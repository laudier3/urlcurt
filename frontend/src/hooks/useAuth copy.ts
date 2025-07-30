import { useState, useEffect } from 'react';
import api from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Verifica se há uma sessão válida no backend
        const res = await api.get('/api/check-auth', { withCredentials: true });

        if (res.status === 200) {
          setIsAuthenticated(true);
          localStorage.setItem('user', 'true'); // apenas marca como logado
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('user');
        }
      } catch (err) {
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await api.post('/api/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Erro ao fazer logout no servidor:', err);
    }

    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, logout };
};
