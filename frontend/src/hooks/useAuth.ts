import { useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  // outros campos que seu usuário tiver
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get<User>('/api/me', { withCredentials: true }); // endpoint para buscar dados do usuário
        if (res.status === 200) {
          setUser(res.data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch {
        setUser(null);
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
      // após login, buscar dados do usuário:
      const userRes = await api.get<User>('/api/me', { withCredentials: true });
      setUser(userRes.data);
      setIsAuthenticated(true);
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = async () => {
    await api.post('/api/logout', {}, { withCredentials: true });
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
}
