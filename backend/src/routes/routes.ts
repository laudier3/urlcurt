import express from 'express';
import { PrismaClient } from '@prisma/client';
import validUrl from 'valid-url';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../services/auth';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import geoip from 'geoip-lite';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

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

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // Ex: seuemail@gmail.com
    pass: process.env.EMAIL_PASSWORD,   // Senha ou App Password
  },
});

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
      //console.log('Usuário já existe com este email!')
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
    //console.error('Esse número de telefone já ta sendo usado por outro usuário, tente outro.:', err);
    res.status(500).json({ error: 'Esse número de telefone já ta sendo usado por outro usuário, tente outro.' });
  }
});

// Recuperação de senha via telefone
/*router.post('/api/recover-password', async (req: any, res: any) => {
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
});*/

// Recuperação de senha via email
router.post('/api/recover-password', async (req: any, res: any) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'E-mail é obrigatório' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado com esse e-mail' });

    const resetToken = generateToken({ id: user.id, email: user.email });
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    // Envio do e-mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <p>Olá, ${user.name}!</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `,
    });

    res.json({ message: 'Link de recuperação enviado para o e-mail' });
  } catch (err) {
    console.error('Erro ao enviar e-mail de recuperação:', err);
    res.status(500).json({ error: 'Erro ao enviar link de recuperação por e-mail' });
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
    /*res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true em produção com HTTPS
      sameSite: 'lax',
      maxAge: 3600000,
    });*/
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // true em prod
      sameSite: 'none', // ou 'none' se domínios diferentes
      maxAge: 3600000, // 1 hora
    });

    res.status(200).json({token: token});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login' });
  }
});
// Rota para retornar a localização do visitante com base no IP
router.get('/api/ip-info', authMiddleware, async (req: any, res: any) => {
  const ip = req.headers['x-forwarded-for']?.toString()?.split(',')[0] || 
             req.socket.remoteAddress || '';

  const geo = geoip.lookup(ip);

  if (!geo) {
    return res.status(404).json({ error: 'Não foi possível localizar o IP.' });
  }

  return res.json({
    ip,
    country: geo.country || null,
    region: geo.region || null,
    city: geo.city || null,
    ll: geo.ll || null, // Latitude e Longitude
    timezone: geo.timezone || null
  });
});

router.get('/api/urls/:id/geo', authMiddleware, async (req: any, res: any) => {
  const urlId = Number(req.params.id);
  const userId = req.userId!;

  const url = await prisma.url.findUnique({ where: { id: urlId } });
  if (!url || url.userId !== userId)
    return res.status(404).json({ error: 'URL não encontrada' });

  const geoData = await prisma.visit.groupBy({
    by: ['country', 'region', 'city'],
    where: { urlId },
    _count: { _all: true },
  });

  const result = geoData.map(g => ({
    country: g.country || 'Desconhecido',
    region: g.region || 'Desconhecido',
    city: g.city || 'Desconhecido',
    count: g._count._all,
  }));

  res.json(result);
});

// --- Verifica usuário logado ---
router.get("/api/me", authMiddleware, async (req: AuthRequest, res:any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        age: true,
      },
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Atualizar perfil completo do usuário autenticado
router.put('/api/me', authMiddleware, async (req: AuthRequest, res: any) => {
  const userId = req.userId!;
  const { name, email, phone, age } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone,
        age: age ? Number(age) : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        age: true,
      },
    });

    res.json(updated);
  } catch (err: any) {
    console.error('Erro ao atualizar usuário:', err);
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Email ou telefone já está em uso.' });
    }
    return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

// Deletar conta do usuário logado
router.delete('/api/me', authMiddleware, async (req: AuthRequest, res: any) => {
  const userId = req.userId!;

  try {
    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Deleta o usuário (URLs e Visits são deletadas automaticamente)
    await prisma.user.delete({
      where: { id: userId },
    });

    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
    });

    return res.json({ message: 'Conta e dados relacionados excluídos com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar conta:', err);
    return res.status(500).json({ error: 'Erro ao excluir conta' });
  }
});

router.post('/api/recover-password', async (req: any, res: any) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-mail é obrigatório' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado com esse e-mail' });

    const resetToken = generateToken({ id: user.id, email: user.email });
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <p>Olá, ${user.name}!</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `,
    });

    res.json({ message: 'Link de recuperação enviado para o e-mail' });
  } catch (err) {
    console.error('Erro ao enviar e-mail de recuperação:', err);
    res.status(500).json({ error: 'Erro ao enviar link de recuperação por e-mail' });
  }
});

router.post('/api/reset-password', async (req: any, res: any) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
  }

  try {
    // Verifica se o token é válido
    const decoded: any = verifyToken(token); // retorna { id, email }

    // Criptografa a nova senha
    const hashed = await hashPassword(newPassword);

    // Atualiza o usuário no banco
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashed },
    });

    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    return res.status(400).json({ error: 'Token inválido ou expirado' });
  }
});

router.get('/api/check', (req: any, res: any) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ authenticated: false });

  try {
    const decoded = verifyToken(token);
    return res.json({ authenticated: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ authenticated: false });
  }
});

// --- Logout (limpa cookie) ---
router.post('/api/logout', (req: any, res: any) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,           // ESSENCIAL para HTTPS
    sameSite: 'None',       // ESSENCIAL para cross-site cookie
    path: '/',              // garante que a exclusão funcione em todo o domínio
  });
  return res.json({ message: 'Logout realizado com sucesso' });
});

router.post('/api/urls', authMiddleware, async (req: AuthRequest, res: any) => {
  const { originalUrl, customSlug } = req.body;
  if (!validUrl.isWebUri(originalUrl)) {
    return res.status(400).json({ error: 'URL inválida' });
  }

  const userId = req.userId!;

  try {
    // 🔒 Verifica se o usuário já tem 10 URLs
    const count = await prisma.url.count({ where: { userId } });
    if (count >= 10) {
      return res.status(403).json({ error: 'Limite de 3 URLs atingido. Exclua uma para adicionar outra.' });
    }

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

    const shortUrlFull = `${process.env.BASE_URL || 'https://urlcurt.site'}/${slug}`;
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
        shortUrl: `${process.env.BASE_URL || 'https://urlcurt.site'}/${shortSlug}`
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

router.get('/:slug', async (req: any, res: any) => {
  const slug = req.params.slug;

  const ip =
    req.headers['x-forwarded-for']?.toString()?.split(',')[0] ||
    req.socket.remoteAddress ||
    '';

  const geo = geoip.lookup(ip);

  try {
    const url = await prisma.url.findUnique({ where: { slug } });
    if (!url) return res.status(404).send('URL não encontrada');

    // Salva o acesso com geolocalização
    await prisma.visit.create({
      data: {
        urlId: url.id,
        country: geo?.country || null,
        region: geo?.region || null,
        city: geo?.city || null,
        ip: ip,
        timestamp: new Date(),
      },
    });

    // Incrementa o contador de visitas
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

export { router };
