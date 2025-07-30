import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth';

// Estende o tipo padrão do Express para incluir os dados do token
export interface AuthRequest extends Request {
  userId?: number;
  email?: string;
}

// Middleware para verificar o token no cookie
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: 'Token não encontrado, você não está logado.' });
    return;
  }

  try {
    const decoded = verifyToken(token) as { id?: number; email?: string };

    if (!decoded.id || !decoded.email) {
      res.status(403).json({ error: 'Token inválido (sem dados necessários)' });
      return;
    }

    req.userId = decoded.id;
    req.email = decoded.email;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido (assinatura ou expiração)' });
    return;
  }
}

