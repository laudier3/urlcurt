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
      const res = await api.get<CheckAuthResponse>('/check', { withCredentials: true });
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

  const logout = async () => {
    try {
      await api.post('/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Erro ao fazer logout', err);
    } finally {
      setIsAuthenticated(false);
    }
  };

  return {
    isAuthenticated,
    loading,
    logout,
    setAuthenticated: setIsAuthenticated,
  };
}
