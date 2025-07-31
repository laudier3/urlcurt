// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import api from '../services/api';


export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simula verificação de sessão
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get('/api/check', { withCredentials: true });
        setIsAuthenticated(res.status === 200);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/login', { email, password }, { withCredentials: true });
    if (res.status === 200) {
      setIsAuthenticated(true);
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = async () => {
    await api.post('/api/logout', {}, { withCredentials: true });
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    login,     // ✅ Adicionado aqui
    logout,
  };
}
