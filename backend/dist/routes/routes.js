"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const valid_url_1 = __importDefault(require("valid-url"));
const auth_1 = require("../services/auth");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
exports.router = router;
const prisma = new client_1.PrismaClient();
// --- Registro ---
router.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    try {
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists)
            return res.status(400).json({ error: 'Usuário já existe' });
        const hashed = await (0, auth_1.hashPassword)(password);
        await prisma.user.create({ data: { email, password: hashed } });
        res.sendStatus(201);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no cadastro' });
    }
});
// --- Login com cookie HTTP‑only ---
router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        const match = await (0, auth_1.comparePassword)(password, user.password);
        if (!match)
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        const token = (0, auth_1.generateToken)({ id: user.id, email: user.email });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // true em produção com HTTPS
            sameSite: 'lax',
            maxAge: 3600000,
        });
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no login' });
    }
});
// --- Verifica usuário logado ---
router.get('/api/me', authMiddleware_1.authMiddleware, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, email: true },
    });
    if (!user)
        return res.sendStatus(404);
    res.json(user);
});
// --- Logout (limpa cookie) ---
router.post('/api/logout', (_req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
    res.sendStatus(200);
});
// --- Encurtar URL ---
router.post('/api/urls', authMiddleware_1.authMiddleware, async (req, res) => {
    const { originalUrl, customSlug } = req.body;
    if (!valid_url_1.default.isWebUri(originalUrl))
        return res.status(400).json({ error: 'URL inválida' });
    const userId = req.userId;
    try {
        let slug = customSlug?.trim() ?? '';
        if (slug) {
            const exists = await prisma.url.findUnique({ where: { slug } });
            if (exists)
                return res.status(400).json({ error: 'Slug personalizado já existe' });
        }
        else {
            const generateSlug = () => {
                const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            };
            do {
                slug = generateSlug();
            } while (await prisma.url.findUnique({ where: { slug } }));
        }
        const shortUrlFull = `${process.env.BASE_URL || 'http://localhost:4000'}/${slug}`;
        const url = await prisma.url.create({
            data: { original: originalUrl, slug, shortUrl: shortUrlFull, userId },
        });
        res.json(url);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao salvar URL' });
    }
});
// --- Listar URLs do usuário ---
router.get('/api/urls', authMiddleware_1.authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const urls = await prisma.url.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ urls });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar URLs' });
    }
});
// --- Deletar URL ---
router.delete('/api/urls/:id', authMiddleware_1.authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'ID inválido' });
    const userId = req.userId;
    try {
        const url = await prisma.url.findUnique({ where: { id } });
        if (!url || url.userId !== userId)
            return res.status(404).json({ error: 'URL não encontrada' });
        await prisma.url.delete({ where: { id } });
        res.json({ message: 'URL deletada com sucesso' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar URL' });
    }
});
// --- Redirect
router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const url = await prisma.url.findUnique({ where: { slug } });
        if (!url)
            return res.status(404).send('URL não encontrada');
        await prisma.visit.create({
            data: {
                urlId: url.id,
            },
        });
        await prisma.url.update({
            where: { slug },
            data: { visits: { increment: 1 } },
        });
        return res.redirect(url.original);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Erro no servidor');
    }
});
router.get('/api/urls/:id/traffic', async (req, res) => {
    try {
        const urlId = Number(req.params.id);
        const visits = await prisma.visit.groupBy({
            by: ['timestamp'],
            where: { urlId },
            _count: {
                timestamp: true,
            },
            orderBy: {
                timestamp: 'asc',
            },
        });
        const result = visits.map((v) => ({
            date: v.timestamp.toISOString().split('T')[0], // yyyy-mm-dd
            count: v._count ? Number(v._count.timestamp) : 0,
        }));
        res.json(result);
    }
    catch (error) {
        console.error('Erro ao buscar tráfego:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});
