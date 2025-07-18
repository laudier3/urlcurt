import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onLogin(): void;
}

const LoginForm: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Realizando o login
      const response = await axios.post(
        'http://app3.apinonshops.store/api/login',
        { email, password },
        { withCredentials: true } // Fazendo o login com cookies
      );

      // Verifique se o login foi bem-sucedido
      console.log('Login bem-sucedido', response);
      
      onLogin(); // Sinaliza login bem-sucedido
    } catch (err: any) {
      if (err.response) {
        // Exibe o erro retornado pelo servidor
        setError(err.response?.data?.error || 'Erro no login');
      } else {
        // Exibe erro se não houver resposta do servidor
        setError('Erro de conexão');
      }
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
