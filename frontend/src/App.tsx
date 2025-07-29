import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UrlForm from './components/UrlForm';
import UrlList from './components/UrlList';
import LandingPage from './components/LandingPage';
import { UrlManager } from './components/UrlManager';
import SobrePage from './components/SobrePage';
import ContatoPage from './components/ContatoPage';
import { Politica } from './components/Politica';

import api from './services/api';
import { useAuth } from './hooks/useAuth';

// Tipos
type Url = { id: number; original: string; slug: string; visits: number; createdAt: string; };
interface UrlResponse { urls: Url[]; }

type ProtectedRouteProps = { isAuthenticated: boolean; children: React.ReactNode; };

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true, state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const [urls, setUrls] = useState<Url[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setUrls([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUrls = async () => {
      setLoadingUrls(true);
      try {
        const res = await api.get<UrlResponse>('/urls', { withCredentials: true });
        setUrls(res.data.urls);
      } catch (err) {
        console.error('Erro ao buscar URLs', err);
      } finally {
        setLoadingUrls(false);
      }
    };

    fetchUrls();
  }, [isAuthenticated]);

  if (loading) return <p>Verificando autenticação...</p>;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    // redireciona sem histórico
    window.location.replace('/');
  };

  const handleNewUrl = async () => {
    setLoadingUrls(true);
    try {
      const res = await api.get<UrlResponse>('/urls', { withCredentials: true });
      setUrls(res.data.urls);
    } catch (err) {
      console.error('Erro ao atualizar URLs após criação', err);
    } finally {
      setLoadingUrls(false);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/app" replace />
              : <LandingPage
                  onLoginClick={() => window.location.assign('/login')}
                  onRegisterClick={() => window.location.assign('/register')}
                  onSobreClick={() => window.location.assign('/sobre')}
                  onContatoClick={() => window.location.assign('/contato')}
                />
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/app" replace />
              : (
                <div className="container" style={{ maxWidth: 400, margin: 'auto', marginTop: "10%" }}>
                  <LoginForm onLogin={() => window.location.assign('/app')} />
                  <p style={{ marginTop: 12 }}>
                    Não tem conta?{' '}
                    <button onClick={() => window.location.assign('/register')} className="link-button">
                      Registre-se
                    </button>
                    <button onClick={() => window.location.assign('/')} className="link-button">
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
            isAuthenticated
              ? <Navigate to="/app" replace />
              : (
                <div className="container" style={{ maxWidth: 400, margin: 'auto', marginTop: "10%" }}>
                  <RegisterForm onRegister={() => window.location.assign('/app')} />
                  <p style={{ marginTop: 12 }}>
                    Já tem conta?{' '}
                    <button onClick={() => window.location.assign('/login')} className="link-button">
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
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h1>Encurtador de URL</h1>
                  <a href="/manager" className="a">Gerenciar URLs</a>
                  <button onClick={handleLogout} disabled={loggingOut}>
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
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h1>Gerenciador de URLs</h1>
                  <a href="/app" className="a">Voltar</a>
                </header>
                <UrlManager />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/url-form"
          element={
            isAuthenticated
              ? <Navigate to="/app" replace />
              : (
                <div style={{ marginTop: 50 }}>
                  <h2>Você já está logado! Redirecionando...</h2>
                </div>
              )
          }
        />

        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/politica" element={<Politica />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
