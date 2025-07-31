import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import LandingPage from '../pages/LandingPage';
import { UrlManager } from '../components/UrlManager';
import SobrePage from '../pages/SobrePage';
import ContatoPage from '../pages/ContatoPage';
import { Politica } from '../pages/Politica';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';
import api from '../services/api';

type Url = {
  id: number;
  original: string;
  slug: string;
  visits: number;
  createdAt: string;
};

type UrlResponse = {
  urls: Url[];
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [urls, setUrls] = useState<Url[]>([]);

  useEffect(() => {
    async function fetchUrls() {
      try {
        // Tipamos o get para informar o tipo da resposta
        const res = await api.get<UrlResponse>('/api/urls');
        setUrls(res.data.urls);
      } catch (err) {
        console.error('Erro ao buscar URLs', err);
      }
    }

    fetchUrls();
  }, []);

  const navigate = useNavigate();

  const handleNewUrl = async () => {
  try {
    const res = await api.get('/api/urls');
    // atualize a lista de URLs aqui
  } catch (err) {
    console.error('Erro ao buscar URLs', err);
  }
};


  return (
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
          isAuthenticated ? <Navigate to="/app" replace /> : <LoginForm />
        }
      />

       <Route
        path="/register"
        element={
          <RegisterForm
            onRegister={() => navigate('/app')}
          />
        }
      />

      <Route
        path="/app"
        element={
            <ProtectedRoute>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1>Encurtador de URL</h1>
                <div style={{width: 300}}>
                    <button onClick={() => navigate('/manager')} 
                    style={{ 
                        marginRight: '10px', 
                        display: "inline-block",
                        width: "65%" 
                    }}>
                    Gerenciar URLs
                    </button>
                    <button
                    onClick={async () => {
                        await logout();
                        navigate('/');
                    }}
                    style={{ backgroundColor: 'red', color: 'white', display: "inline-block", width: "30%" }}
                    >
                    Sair
                    </button>
                </div>
                </div>

                <UrlForm onNewUrl={handleNewUrl} />
                <UrlList urls={urls} />
            </div>
            </ProtectedRoute>
        }
        />

      <Route
        path="/manager"
        element={
          <ProtectedRoute>
            <div className="container">
              <h1>Gerenciador de URLs</h1>
              <UrlManager />
            </div>
          </ProtectedRoute>
        }
      />

      <Route path="/sobre" element={<SobrePage />} />
      <Route path="/contato" element={<ContatoPage />} />
      <Route path="/politica" element={<Politica />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
