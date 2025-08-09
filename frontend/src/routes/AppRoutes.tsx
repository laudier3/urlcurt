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
import ProtectedResetPassword from "../components/ProtectedResetPassword";
import SearchIcon from '@mui/icons-material/Search';

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
  const [searchTerm, setSearchTerm] = useState("");

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
                    <div style={{ flex: 1 }}>
                      <h1>Encurtador de URL</h1>
                      <input
                        type="text"
                        placeholder="Buscar URLs encurtadas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 36px 8px 12px",
                          borderRadius: "20px",
                          border: "1.5px solid #999",
                          outline: "none",
                          fontSize: "14px",
                          transition: "border-color 0.3s",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#4F46E5")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#999")}
                      />
                      <SearchIcon
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#666",
                          pointerEvents: "none",
                          fontSize: 18,
                        }}
                      />
                    </div>
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
                    </div>
                  </div>

                  <UrlForm onNewUrl={handleNewUrl} />
                  <UrlList
                    urls={urls.filter((url) =>
                      url.slug.toLowerCase().includes(searchTerm.toLowerCase())
                    )}
                  />
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
                      alignItems: "center",
                    }}
                  >
                  <div >
                    <h1 style={{ display: "inline-block", marginLeft: "10px" }}>
                      Gerenciador de URLs
                    </h1>
                    <input
                      type="text"
                      placeholder="Buscar URLs encurtadas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 36px 8px 12px",
                        borderRadius: "20px",
                        border: "1.5px solid #999",
                        outline: "none",
                        fontSize: "14px",
                        transition: "border-color 0.3s",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#4F46E5")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#999")}
                    />
                    <SearchIcon
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#666",
                        pointerEvents: "none",
                        fontSize: 18,
                      }}
                    />
                    </div>
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

                  <UrlManager search={searchTerm} />
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
        <Route path="/reset-password" element={<ProtectedResetPassword />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
