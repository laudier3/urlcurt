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
      navigate('/app');
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Usuário ou senha incorreta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container" style={styles.form}>
      <h2 style={styles.title}>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={styles.input}
      />

      <div style={styles.passwordWrapper}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ ...styles.input, paddingRight: '2.5rem' }}
        />
        <span
          onClick={() => setShowPassword(prev => !prev)}
          style={styles.eyeIcon}
          role="button"
          tabIndex={0}
        >
          {showPassword ? '🙈' : '👁️'}
        </span>
      </div>

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.linkContainer}>
        <span style={{ marginRight: 6, color: '#777' }}>Primeira vez na UrlCurt?</span>
        <button
          type="button"
          onClick={() => navigate('/register')}
          style={styles.linkButton}
        >
          Criar conta
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate('/')}
        style={{ ...styles.linkButton, marginTop: '12px', color: '#444' }}
      >
        Voltar para Home
      </button>
      <button
        type="button"
        onClick={() => navigate('/recover-password')}
        style={{ ...styles.linkButton, marginTop: '12px', color: '#007bff' }}
      >
        Esqueci minha senha
      </button>

    </form>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '30px',
    background: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '24px',
    textAlign: 'center',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#888',
    userSelect: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4F46E5',
    color: 'white',
    fontWeight: 600,
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
    fontWeight: 500,
  },
  linkContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: '#4F46E5',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
  },
};

export default LoginForm;
