import React, { useState } from 'react';
import api from '../services/api';
import Navbar from "./Navbar";

interface Props {
  onNewUrl(shortUrl: string): void;
}

interface CreateUrlResponse {
  shortUrl: string;
}

const UrlForm: React.FC<Props> = ({ onNewUrl }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post<CreateUrlResponse>(
        '/api/urls',
        { originalUrl, customSlug: customSlug || undefined },
        { withCredentials: true }
      );

      onNewUrl(res.data.shortUrl);
      setOriginalUrl('');
      setCustomSlug('');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Erro ao criar URL');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
     <Navbar/>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <h2>Encurtar URL</h2>
        <input
          type="url"
          placeholder="URL original"
          value={originalUrl}
          onChange={e => setOriginalUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Slug personalizado (opcional)"
          value={customSlug}
          onChange={e => setCustomSlug(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
      </form>
    </>
  );
};

export default UrlForm;
