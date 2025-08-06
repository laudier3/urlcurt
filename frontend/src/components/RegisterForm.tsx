import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface RegisterResponse {
  token?: string;
  error?: string;
}

interface Props {
  onRegister(token: string): void;
}

const RegisterForm: React.FC<Props> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // ✅ Novo estado

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false); // ✅ Limpa estado anterior

    if (!name || !email || !password || !confirmPassword || !phone || !age) {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post<RegisterResponse>(
        '/api/register',
        {
          name,
          email,
          password,
          phone,
          age,
        },
        {
          withCredentials: true, // Mover para o terceiro argumento
        }
      );

      console.log('API response:', res.data);

      if (res.data.token) {
        setSuccess(true); // ✅ Mostra mensagem
        setTimeout(() => {
          navigate('/login'); // ✅ Redireciona após 4 segundos
        }, 5000);
      } else {
        setError('Erro ao registrar usuário.');
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro inesperado ao registrar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container" style={styles.form}>
      <h2 style={styles.title}>Criar Conta</h2>

      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={styles.input}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={styles.input}
      />

      {/* Senha */}
      <div style={styles.passwordWrapper}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ ...styles.input, paddingRight: '2.5rem' }}
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          style={styles.eyeIcon}
          role="button"
          tabIndex={0}
        >
          {showPassword ? '🙈' : '👁️'}
        </span>
      </div>

      {/* Confirmar senha */}
      <div style={styles.passwordWrapper}>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ ...styles.input, paddingRight: '2.5rem' }}
        />
        <span
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          style={styles.eyeIcon}
          role="button"
          tabIndex={0}
        >
          {showConfirmPassword ? '🙈' : '👁️'}
        </span>
      </div>

      <input
        type="text"
        placeholder="Telefone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        style={styles.input}
      />

      <input
        type="number"
        placeholder="Idade"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
        style={styles.input}
      />

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Cadastrando...' : 'Registrar'}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {success && (
        <p style={styles.success}>
          Usuário criado com sucesso! Redirecionando para login...
        </p>
      )}

      <div style={styles.linkContainer}>
        <span style={{ marginRight: 6, color: '#777' }}>Já tem uma conta?</span>
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={styles.linkButton}
        >
          Entrar
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate('/')}
        style={{ ...styles.linkButton, marginTop: '12px', color: '#444' }}
      >
        Voltar para Home
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
  success: {
    color: 'green',
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

export default RegisterForm;
