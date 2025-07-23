import React, { useState } from 'react';
import api from '../services/api'; // Supondo que você já tenha o Axios configurado corretamente

// Definindo o tipo da resposta que esperamos do backend
interface RegisterResponse {
  token?: string;
  error?: string;
}

interface Props {
  onRegister(token: string): void;
}

const RegisterForm: React.FC<Props> = ({ onRegister }) => {
  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | string>(''); // Idade pode ser um número ou vazio
  const [error, setError] = useState('');

  // Função que lida com o envio do formulário
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); // Limpa o erro anterior

    // Validação simples para garantir que todos os campos foram preenchidos
    if (!name || !email || !password || !phone || !age) {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    try {
      // Fazendo a requisição POST para o backend
      const res = await api.post<RegisterResponse>('/register', { name, email, password, phone, age });

      console.log(res)

      // Se o token for retornado na resposta
      if (res.data.token) {
        onRegister(res.data.token); // Passa o token para o componente pai
      } else {
        setError('Erro ao registrar usuário.'); // Caso não retorne token
      }
    } catch (err: any) {
      console.error('Erro:', err);

      // Verifica se a resposta de erro contém uma mensagem
      if (err.response?.data?.error) {
        setError(err.response.data.error); // Exibe o erro retornado pelo backend
      } else {
        setError('Erro inesperado ao registrar.');
      }
    }
  }

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

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

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
