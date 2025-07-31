import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import UrlForm from "../components/UrlForm";
import UrlList from "../components/UrlList";
import LandingPage from "../pages/LandingPage";
import { UrlManager } from "../components/UrlManager";
import SobrePage from "../pages/SobrePage";
import ContatoPage from "../pages/ContatoPage";
import { Politica } from "../pages/Politica";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "../components/ProtectedRoute";
import api from "../services/api";
import Loading from "../components/Loading";
import { RecoverPassword } from "../components/RecoverPassword";
import { AuthProvider } from "../store/context";
import { UserProfileEditor } from "../components/UserProfileEditor";

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
  const { isAuthenticated, loading: authLoading } = useAuth(); //logout
  const [urls, setUrls] = useState<Url[]>([]);
  const [loadingApp, setLoadingApp] = useState(true);
  const [loadingManager, setLoadingManager] = useState(false);

  const navigate = useNavigate();

  const fetchUrls = async () => {
    setLoadingApp(true);
    try {
      const res = await api.get<UrlResponse>("/api/urls");
      setUrls(res.data.urls);
    } catch (err) {
      console.error("Erro ao buscar URLs", err);
    } finally {
      setLoadingApp(false);
    }
  };

  useEffect(() => {
    const fetchManagerData = async () => {
      setLoadingManager(true);
      try {
        // await api.get('/api/manager'); // exemplo
      } finally {
        setLoadingManager(false);
      }
    };

    fetchManagerData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUrls();
    }
  }, [isAuthenticated]);

  const handleNewUrl = async () => {
    try {
      const res = await api.get<UrlResponse>("/api/urls");
      setUrls(res.data.urls);
    } catch (err) {
      console.error("Erro ao buscar URLs", err);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <LandingPage
                onLoginClick={() => navigate("/login")}
                onRegisterClick={() => navigate("/register")}
                onSobreClick={() => navigate("/sobre")}
                onContatoClick={() => navigate("/contato")}
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
                <div className="container">
                  <LoginForm />
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
              <div className="container">
                <RegisterForm onRegister={() => navigate("/app")} />
              </div>
            )
          }
          />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              {loadingApp ? (
                <Loading />
              ) : (
                <div className="container">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                    >
                    <h1>Encurtador de URL</h1>
                    <div style={{ width: 300 }}>
                      <button
                        onClick={() => navigate("/manager")}
                        style={{
                          marginLeft: "60px",
                          display: "inline-block",
                          width: "65%",
                        }}
                        >
                        Gerenciar URLs
                      </button>
                      {/*<button
                        onClick={async () => {
                          await logout();
                          navigate("/");
                        }}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          display: "inline-block",
                          width: "30%",
                        }}
                        >
                        Sair
                      </button>*/}
                    </div>
                  </div>

                  <UrlForm onNewUrl={handleNewUrl} />
                  <UrlList urls={urls} />
                </div>
              )}
            </ProtectedRoute>
          }
          />

        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              {loadingManager ? (
                <Loading />
              ) : (
                <div className="container">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                    >
                    <h1>Gerenciador de URLs</h1>
                    <button
                      onClick={() => navigate("/app")}
                      style={{
                        backgroundColor: "#4F46E5",
                        color: "white",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        height: "35px",
                        width: "100px",
                      }}
                      >
                      Voltar
                    </button>
                  </div>
                  <UrlManager />
                </div>
              )}
            </ProtectedRoute>
          }
          />

        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/politica" element={<Politica />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/edit-profile" element={<UserProfileEditor />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
