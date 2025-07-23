import express from 'express';
import { PrismaClient } from '@prisma/client';
import validUrl from 'valid-url';
import { hashPassword, comparePassword, generateToken } from '../services/auth';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import twilio from 'twilio';

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSms(phone: string, message: string) {
    try {
        await twilioClient.messages.create({
            to: phone,
            from: process.env.TWILIO_PHONE_NUMBER, // Número que você obteve no Twilio
            body: message,
        });
    } catch (err) {
        console.error('Erro ao enviar SMS:', err);
        throw new Error('Erro ao enviar SMS');
    }
}

const router = express.Router();
const prisma = new PrismaClient();

// --- Registro ---
router.post('/api/register', async (req: any, res: any) => {
  const { name, email, password, phone, age } = req.body;

  console.log("Chegando...")

  // Verifica se todos os campos necessários foram preenchidos
  if (!name || !email || !password || !phone || !age) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    // Verifica se o usuário já existe
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: 'Usuário já existe com este email!' });
    }

    // Criptografar a senha
    const hashedPassword = await hashPassword(password);

    // Criação do usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        age: Number(age), // Certifique-se de que a idade seja numérica
      },
    });

    // Gerar o token JWT
    const token = generateToken({ id: user.id, email: user.email });

    // Retornar o token para o frontend
    res.status(201).json({ token });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ error: 'Erro no servidor, tente novamente mais tarde' });
  }
});

// Recuperação de senha via telefone
router.post('/api/recover-password', async (req: any, res: any) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Telefone é obrigatório' });

  try {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado com esse telefone' });

    // Geração de token temporário
    const resetToken = generateToken({ id: user.id, email: user.email }); // Agora passamos o email
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    // Enviar o link de recuperação por SMS
    await sendSms(phone, `Clique no link para redefinir sua senha: ${resetLink}`);
    
    res.json({ message: 'Link de recuperação enviado por SMS' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao enviar link de recuperação' });
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

// --- Atualizar URL ---
router.put('/api/urls/:id', authMiddleware, async (req: AuthRequest, res: any) => {
  const id = Number(req.params.id);
  const { originalUrl, shortSlug } = req.body;

  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const url = await prisma.url.findUnique({ where: { id } });
    if (!url || url.userId !== req.userId) {
      return res.status(404).json({ error: 'URL não encontrada ou sem permissão' });
    }

    // Verifica se o slug novo já existe (e não é o mesmo da URL atual)
    if (shortSlug !== url.slug) {
      const slugExists = await prisma.url.findUnique({ where: { slug: shortSlug } });
      if (slugExists) return res.status(400).json({ error: 'Slug já em uso' });
    }

    const updated = await prisma.url.update({
      where: { id },
      data: {
        original: originalUrl,
        slug: shortSlug,
        shortUrl: `${process.env.BASE_URL || 'http://localhost:4000'}/${shortSlug}`
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar URL' });
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

router.get('/api/urls/:id/traffic', async (req: any, res: any) => {
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
