// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import api from '../services/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Checa se o token é válido com base no cookie (enviado automaticamente)
  const checkAuth = async () => {
    try {
      await api.get('/me', { withCredentials: true });
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Logout no backend + atualiza estado
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
    // setIsAuthenticated só se você quiser alterar manualmente no login
    setAuthenticated: setIsAuthenticated,
  };
}
