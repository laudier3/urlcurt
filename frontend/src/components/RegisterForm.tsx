import React, { useState } from 'react';
import api from '../services/api';

interface Props {
  onRegister(token: string): void;
}

const RegisterForm: React.FC<Props> = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/register', { email, password });
      onRegister(res.data.token);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro inesperado ao registrar.');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Registrar</button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </form>
  );
};

export default RegisterForm;
