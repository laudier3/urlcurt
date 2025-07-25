import React, { useState, useEffect, ReactNode } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UrlForm from './components/UrlForm';
import UrlList from './components/UrlList';
import LandingPage from './components/LandingPage';
import { UrlManager } from './components/UrlManager';
import api from './services/api';
import { useAuth } from './hooks/useAuth';

// Tipos
type Url = {
  id: number;
  original: string;
  slug: string;
  visits: number;
  createdAt: string;
};

interface UrlResponse {
  urls: Url[];
}

type ProtectedRouteProps = {
  isAuthenticated: boolean;
  children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const [urls, setUrls] = useState<Url[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setUrls([]); // limpa urls se deslogar
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchUrls() {
      setLoadingUrls(true);
      try {
        const res = await api.get<UrlResponse>('/urls', { withCredentials: true });
        setUrls(res.data.urls);
      } catch (err) {
        console.error('Erro ao buscar URLs', err);
      } finally {
        setLoadingUrls(false);
      }
    }

    fetchUrls();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

  async function handleNewUrl() {
    setLoadingUrls(true);
    try {
      const res = await api.get<UrlResponse>('/urls', { withCredentials: true });
      setUrls(res.data.urls);
    } catch (err) {
      console.error('Erro ao atualizar URLs após criação', err);
    } finally {
      setLoadingUrls(false);
    }
  }

  if (loading) {
    return <p>Verificando autenticação...</p>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <LandingPage
                onLoginClick={() => window.location.assign('/login')}
                onRegisterClick={() => window.location.assign('/register')}
              />
            )
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <div className="container" style={{ maxWidth: 400, margin: 'auto', marginTop: "10%" }}>
                <LoginForm onLogin={() => window.location.assign('/app')} />
                <p style={{ marginTop: 12 }}>
                  Não tem conta?{' '}
                  <button
                    onClick={() => window.location.assign('/register')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4f46e5',
                      cursor: 'pointer',
                    }}
                  >
                    Registre-se
                  </button>
                  <button
                    onClick={() => window.location.assign('/')}
                    style={{
                      background: 'none',
                      border: 'solid 1px',
                      color: '#4f46e5',
                      cursor: 'pointer',
                    }}
                  >
                    Voltar
                  </button>
                </p>
              </div>
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <div className="container" style={{ maxWidth: 400, margin: 'auto', marginTop: "10%" }}>
                <RegisterForm onRegister={() => window.location.assign('/app')} />
                <p style={{ marginTop: 12 }}>
                  Já tem conta?{' '}
                  <button
                    onClick={() => window.location.assign('/login')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4f46e5',
                      cursor: 'pointer',
                    }}
                  >
                    Faça login
                  </button>
                </p>
              </div>
            )
          }
        />

        <Route
          path="/app"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <div className="container">
                <header
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                  }}
                >
                  <h1>Encurtador de URL</h1>
                  <a href="/manager" className='a' style={{
                    width: 'auto',
                    padding: '0.5rem 1rem',
                    textDecoration: "none"
                  }}>
                    {loggingOut ? 'Carregando...' : 'Gerenciar URLS'}
                  </a>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    style={{ width: 'auto', padding: '0.5rem 1rem' }}
                  >
                    {loggingOut ? 'Saindo...' : 'Sair'}
                  </button>
                </header>

                <UrlForm onNewUrl={handleNewUrl} />
                {loadingUrls ? <p>Carregando URLs...</p> : <UrlList urls={urls} />}
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <div className="container">
                <header
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                  }}
                >
                  <h1>Gerenciador de URLs</h1>
                  <a href='/app' className='a' style={{
                    width: 'auto',
                    padding: '0.5rem 1rem',
                    textDecoration: "none",
                  }}>
                    {loggingOut ? 'Saindo...' : 'Voltar'}
                  </a>
                </header>

                <UrlManager />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/url-form"
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <div style={{ marginTop: 50 }}>
                <h2>Você já está logado! Redirecionando para a página principal...</h2>
              </div>
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
