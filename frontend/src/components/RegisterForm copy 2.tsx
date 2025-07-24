import React, { useState } from 'react';
import api from '../services/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | string>('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword || !phone || !age) {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    try {
      const res = await api.post<RegisterResponse>('/register', {
        name,
        email,
        password,
        phone,
        age,
      });

      if (res.data.token) {
        onRegister(res.data.token);
      } else {
        setError('Erro ao registrar usuário.');
      }
    } catch (err: any) {
      console.error('Erro:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro inesperado ao registrar.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar</h2>

      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div style={{ position: 'relative' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div style={{ position: 'relative' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirme a Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
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
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>

      </div>

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        style={{ marginBottom: '10px' }}
      >
        {showPassword ? 'Ocultar Senhas' : 'Mostrar Senhas'}
      </button>

      <input
        type="text"
        placeholder="Telefone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Idade"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />

      <button type="submit">Registrar</button>

      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </form>
  );
};

export default RegisterForm;
