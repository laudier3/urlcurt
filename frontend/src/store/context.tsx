// hooks/useAuth.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    await api.post('/api/login', { email, password }, { withCredentials: true });
    await fetchUser();
  };

  const fetchUser = async () => {
    const res = await api.get<User>('/api/me', { withCredentials: true });
    setUser(res.data);
  };

  const logout = async () => {
    await api.post('/api/logout', {}, { withCredentials: true });
    setUser(null);
  };

  useEffect(() => {
    fetchUser().catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
