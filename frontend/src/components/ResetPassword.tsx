import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token') || '';
    setToken(tokenFromUrl);
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');

    if (!token) {
      setStatus('Token inválido ou expirado.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/reset-password', {
        token,
        newPassword, // ✅ nome correto aqui
      });

      setStatus('Senha redefinida com sucesso! Você será redirecionado para o login.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      setStatus(error.response?.data?.error || 'Erro ao redefinir a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Redefinir Senha</h2>

      <input
        type="password"
        placeholder="Nova senha"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
        style={inputStyle}
        minLength={6}
      />

      <input
        type="password"
        placeholder="Confirme a nova senha"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
        style={inputStyle}
        minLength={6}
      />

      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Redefinindo...' : 'Redefinir senha'}
      </button>

      {status && <p style={{ marginTop: 12, color: '#555' }}>{status}</p>}
    </form>
  );
};

const formStyle: React.CSSProperties = {
  maxWidth: 400,
  margin: '40px auto',
  padding: 30,
  background: '#f9f9f9',
  borderRadius: 10,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 12,
  marginBottom: 16,
  borderRadius: 5,
  border: '1px solid #ccc',
  fontSize: 16,
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: 12,
  backgroundColor: '#4F46E5',
  color: 'white',
  fontWeight: 600,
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
};
