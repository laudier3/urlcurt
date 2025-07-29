import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UrlForm from './components/UrlForm';
import UrlList from './components/UrlList';
import LandingPage from './components/LandingPage';
import { UrlManager } from './components/UrlManager';
import api from './services/api';
import { useAuth } from './hooks/useAuth';

import SobrePage from './components/SobrePage';
import ContatoPage from './components/ContatoPage';
import { Politica } from './components/Politica';

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
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true, state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const [urls, setUrls] = useState<Url[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setUrls([]);
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
    try {
      await api.post('/logout', null, { withCredentials: true });

      logout(); // Atualiza contexto para refletir deslogado
      setUrls([]);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Erro ao sair:', err);
      alert('Erro ao sair. Tente novamente.');
    } finally {
      setLoggingOut(false);
    }
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
                onLoginClick={() => navigate('/login')}
                onRegisterClick={() => navigate('/register')}
                onSobreClick={() => navigate('/sobre')}
                onContatoClick={() => navigate('/contato')}
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
              <div className="container" style={{ maxWidth: 400, margin: 'auto', marginTop: '10%' }}>
                <LoginForm onLogin={() => navigate('/app')} />
                <p style={{ marginTop: 12 }}>
                  Não tem conta?{' '}
                  <button
                    onClick={() => navigate('/register')}
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
                    onClick={() => navigate('/')}
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
              <div className="container" style={{ maxWidth: 400, margin: 'auto', marginTop: '10%' }}>
                <RegisterForm onRegister={() => navigate('/app')} />
                <p style={{ marginTop: 12 }}>
                  Já tem conta?{' '}
                  <button
                    onClick={() => navigate('/login')}
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
                  <button
                    onClick={() => navigate('/manager')}
                    style={{ width: 'auto', padding: '0.5rem 1rem' }}
                  >
                    Gerenciar URLs
                  </button>
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
                  <button
                    onClick={() => navigate('/app')}
                    style={{ width: 'auto', padding: '0.5rem 1rem' }}
                  >
                    Voltar
                  </button>
                </header>

                <UrlManager />
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="/url-form" element={<Navigate to="/app" replace />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/politica" element={<Politica />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
