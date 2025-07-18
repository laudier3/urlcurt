import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/*export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}*/

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Erro ao comparar senhas:', error);
    return false;
  }
};

/*export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}*/

export const generateToken = (user: { id: number; email: string }) => {
  // Exemplo de como gerar um token com JWT
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET || 'seu-segredo', // Certifique-se de que a chave secreta está correta
    { expiresIn: '1h' } // Definindo o token para expirar em 1 hora
  );
};

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

