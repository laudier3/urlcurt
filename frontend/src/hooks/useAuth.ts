import { useState, useEffect } from 'react';
import api from '../services/api';

interface CheckAuthResponse {
  user?: {
    id: number;
    email: string;
  };
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get<CheckAuthResponse>('/api/check', { withCredentials: true });
      if (res.data.user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await api.post('/api/login', { email, password }, { withCredentials: true });
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
      throw err; // Opcional: propagar erro para tratar no componente
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Erro ao fazer logout', err);
    } finally {
      setIsAuthenticated(false);
    }
  };

  return {
    isAuthenticated,
    loading,
    login,               // <== função login adicionada aqui
    logout,
    setAuthenticated: setIsAuthenticated,
  };
}
