import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/app'); // redireciona sem recarregar
      window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Usuário ou senha incorreta');
    } finally {
      setLoading(false);
    }
  };

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

      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ paddingRight: '2.5rem', width: '100%' }}
        />
        <span
          onClick={() => setShowPassword(prev => !prev)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#888',
            userSelect: 'none',
          }}
          role="button"
          tabIndex={0}
        >
          {showPassword ? '🙈' : '👁️'}
        </span>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
    </form>
  );
};

export default LoginForm;
