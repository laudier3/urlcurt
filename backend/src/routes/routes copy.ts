import express from 'express';
import { PrismaClient } from '@prisma/client';
import validUrl from 'valid-url';
import { hashPassword, comparePassword, generateToken } from '../services/auth';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

// --- Registro ---
router.post('/api/register', async (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Usuário já existe' });

    const hashed = await hashPassword(password);
    await prisma.user.create({ data: { email, password: hashed } });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no cadastro' });
  }
});

// --- Login com cookie HTTP‑only ---
router.post('/api/login', async (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Usuário ou senha incorretos' });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ error: 'Usuário ou senha incorretos' });

    const token = generateToken({ id: user.id, email: user.email });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true em produção com HTTPS
      sameSite: 'lax',
      maxAge: 3600000,
    });

    res.status(200).json({token: token});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login' });
  }
});

// --- Verifica usuário logado ---
router.get('/api/me', authMiddleware, async (req: AuthRequest, res: any) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { id: true, email: true },
  });
  if (!user) return res.sendStatus(404);
  res.json(user);
});

// --- Logout (limpa cookie) ---
router.post('/api/logout', (_req: any, res: any) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.sendStatus(200);
});

// --- Encurtar URL ---
router.post('/api/urls', authMiddleware, async (req: AuthRequest, res: any) => {
  const { originalUrl, customSlug } = req.body;
  if (!validUrl.isWebUri(originalUrl)) return res.status(400).json({ error: 'URL inválida' });

  const userId = req.userId!;
  try {
    let slug = customSlug?.trim() ?? '';
    if (slug) {
      const exists = await prisma.url.findUnique({ where: { slug } });
      if (exists) return res.status(400).json({ error: 'Slug personalizado já existe' });
    } else {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar URL' });
  }
});

// --- Listar URLs do usuário ---
router.get('/api/urls', authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  try {
    const urls = await prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar URLs' });
  }
});

// --- Deletar URL ---
router.delete('/api/urls/:id', authMiddleware, async (req: AuthRequest, res: any) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const userId = req.userId!;
  try {
    const url = await prisma.url.findUnique({ where: { id } });
    if (!url || url.userId !== userId) return res.status(404).json({ error: 'URL não encontrada' });

    await prisma.url.delete({ where: { id } });
    res.json({ message: 'URL deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar URL' });
  }
});

// --- Redirect
router.get('/:slug', async (req: any, res: any) => {
  const { slug } = req.params;
  
  try {
    const url = await prisma.url.findUnique({ where: { slug } });
    if (!url) return res.status(404).send('URL não encontrada');

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
  } catch (err) {
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
  } catch (error) {
    console.error('Erro ao buscar tráfego:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// GET /api/urls/:id/traffic
/*router.get('/api/urls/:id/traffic', authMiddleware, async (req: AuthRequest, res: any) => {
  const urlId = parseInt(req.params.id);
  const userId = req.userId!;

  // Verifique se a URL pertence ao usuário
  const url = await prisma.url.findUnique({ where: { id: urlId } });
  if (!url || url.userId !== userId) return res.status(404).json({ error: 'URL não encontrada' });

  // Agrupe por dia
  const data = await prisma.$queryRawUnsafe(`
    SELECT 
      DATE("timestamp") as date, 
      COUNT(*) as count 
    FROM "Visit" 
    WHERE "urlId" = ${urlId}
    GROUP BY DATE("timestamp")
    ORDER BY date ASC;
  `);

  res.json(data);
});*/

export { router };
