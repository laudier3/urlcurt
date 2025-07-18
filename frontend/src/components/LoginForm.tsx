import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate

interface Props {
  onLogin(): void;
}

const LoginForm: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Verificando o token
const token = getCookie('token');  // Substitua 'token' pelo nome real do cookie que armazena o token

if (token) {
  console.log('Token encontrado:', token);
} else {
  console.log('Token não encontrado');
}


  const navigate = useNavigate(); // Usando o hook para navegação

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Envia o login para o backend
      await axios.post(
        'https://app3.apinonshops.store/api/login',
        { email, password },
        { withCredentials: true }
      );

      onLogin(); // sinaliza login bem-sucedido

      // Navega para a página /app após o login bem-sucedido
      navigate('/app'); // Usando o useNavigate para redirecionar para /app
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro no login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Carregando...' : 'Entrar'}
      </button>
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
    </form>
  );
};

export default LoginForm;
