import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UrlForm from './components/UrlForm';
import UrlList from './components/UrlList';
import LandingPage from './components/LandingPage';
import api from './services/api';
import { useAuth } from './hooks/useAuth';

type Url = {
  id: number;
  original: string;
  slug: string;
  visits: number;
  createdAt: string;
};

const App: React.FC = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const [urls, setUrls] = useState<Url[]>([]);
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'app'>('landing');
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Atualiza a view automaticamente quando a verificação de autenticação termina
  useEffect(() => {
    if (!loading) {
      setView(isAuthenticated ? 'app' : 'landing');
    }
  }, [loading, isAuthenticated]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await logout();
    setView('landing');
    setLoggingOut(false);
  };

  useEffect(() => {
    if (view !== 'app') return;

    async function fetchUrls() {
      setLoadingUrls(true);
      try {
        const res = await api.get('/urls', { withCredentials: true });
        setUrls(res.data.urls);
      } catch (err) {
        console.error('Erro ao buscar URLs', err);
      } finally {
        setLoadingUrls(false);
      }
    }

    fetchUrls();
  }, [view]);

  function handleAuth() {
    setView('app');
  }

  async function handleNewUrl() {
    setLoadingUrls(true);
    try {
      const res = await api.get('/urls', { withCredentials: true });
      setUrls(res.data.urls);
    } catch (err) {
      console.error('Erro ao atualizar URLs após criação', err);
    } finally {
      setLoadingUrls(false);
    }
  }

  if (loading) {
    return <p>Verificando autenticação...</p>; // ou um spinner
  }

  if (view === 'landing') {
    return <LandingPage onLoginClick={() => setView('login')} onRegisterClick={() => setView('register')} />;
  }

  if (view === 'login') {
    return (
      <div className="container">
        <LoginForm onLogin={handleAuth} />
        <p style={{ marginTop: 12 }}>
          Não tem conta?{' '}
          <button onClick={() => setView('register')} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer' }}>
            Registre-se
          </button>
        </p>
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className="container">
        <RegisterForm onRegister={handleAuth} />
        <p style={{ marginTop: 12 }}>
          Já tem conta?{' '}
          <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer' }}>
            Faça login
          </button>
        </p>
      </div>
    );
  }

  return (
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
  );
};

export default App;
