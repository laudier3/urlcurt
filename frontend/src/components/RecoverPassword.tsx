import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface RecoverPasswordResponse {
  message: string;
}

export const RecoverPassword: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    try {
        // 2. Tipar a resposta do Axios aqui:
        const res = await api.post<RecoverPasswordResponse>('/api/recover-password', { phone });
        
        // 3. Agora o TypeScript entende que res.data.message existe
        setStatus(res.data.message || 'Link enviado com sucesso');
    } catch (err: any) {
        setStatus(err.response?.data?.error || 'Erro ao enviar link de recuperação');
    } finally {
        setLoading(false);
    }
    };

  return (
    <form onSubmit={handleSubmit} className="container" style={styles.form}>
      <h2 style={styles.title}>Recuperar Senha</h2>

      <input
        type="text"
        placeholder="Digite seu telefone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        style={styles.input}
      />

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Enviando...' : 'Enviar link por SMS'}
      </button>

      {status && <p style={{ marginTop: 12, color: '#555' }}>{status}</p>}

      <button
        type="button"
        onClick={() => navigate('/login')}
        style={styles.link}
      >
        Voltar para login
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
  link: {
    background: 'none',
    border: 'none',
    marginTop: '20px',
    textDecoration: 'underline',
    cursor: 'pointer',
    color: '#007bff',
  },
};

