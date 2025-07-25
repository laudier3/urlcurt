import React, { useState } from 'react';
import { Alert } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';

type Url = {
  id: number;
  original: string;
  slug: string;
  visits: number;
  createdAt: string;
};

type TrafficEntry = {
  date: string;
  count: number;
};

type Props = {
  urls: Url[];
};

const UrlList: React.FC<Props> = ({ urls }) => {
  const [expandedUrlId, setExpandedUrlId] = useState<number | null>(null);
  const [trafficData, setTrafficData] = useState<Record<number, TrafficEntry[]>>({});
  const [loadingTraffic, setLoadingTraffic] = useState<number | null>(null);
  const [copiedUrlId, setCopiedUrlId] = useState<number | null>(null);

  const handleCopy = (urlId: number, shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedUrlId(urlId);
    setTimeout(() => setCopiedUrlId(null), 2000);
  };

  const fetchTrafficData = async (urlId: number) => {
    if (expandedUrlId === urlId) {
      // Ocultar gráfico se já estiver expandido
      setExpandedUrlId(null);
      return;
    }

    setLoadingTraffic(urlId);
    try {
      const res = await api.get(`/urls/${urlId}/traffic`, { withCredentials: true });
      const formatted = res.data.map((entry: any) => ({
        date: entry.date,
        count: entry.count,
      }));
      setTrafficData((prev) => ({ ...prev, [urlId]: formatted }));
      setExpandedUrlId(urlId);
    } catch (err) {
      console.error('Erro ao buscar dados de tráfego', err);
    } finally {
      setLoadingTraffic(null);
    }
  };

  if (urls.length === 0) {
    return <p>Você ainda não criou nenhuma URL.</p>;
  }

  return (
    <div>
      <h2>Suas URLs</h2>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {urls.map((url) => {
          const shortUrl = `https://app3.apinonshops.store/${url.slug}`;
          const isExpanded = expandedUrlId === url.id;
          const isLoading = loadingTraffic === url.id;
          const history = trafficData[url.id];

          return (
            <li
              key={url.id}
              style={{
                marginBottom: '1.5rem',
                borderBottom: '1px solid #ccc',
                paddingBottom: '1rem',
              }}
            >
              <div>
                <Alert severity="success">
                  URL encurtada:{' '}
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                    {shortUrl}
                  </a>{' '}
                  <button
                    onClick={() => handleCopy(url.id, shortUrl)}
                    style={{
                      padding: '2px 6px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      backgroundColor: copiedUrlId === url.id ? '#10b981' : '#e5e7eb',
                      color: copiedUrlId === url.id ? 'white' : 'black',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      marginRight: '0.5rem',
                    }}
                  >
                    {copiedUrlId === url.id ? 'Copiado...' : 'Copiar'}
                  </button>

                  <button
                    onClick={() => fetchTrafficData(url.id)}
                    style={{
                      padding: '2px 6px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  >
                    {isExpanded ? 'Ocultar gráfico' : isLoading ? 'Carregando...' : 'Ver gráfico'}
                  </button>
                </Alert>
              </div>

              {isExpanded && history && (
                <div
                  style={{
                    marginTop: '1rem',
                    backgroundColor: '#f4f4f4',
                    padding: '10px',
                    borderRadius: '6px',
                  }}
                >
                  <h4>Tráfego nos últimos dias</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                          new Date(date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                          })
                        }
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#4f46e5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UrlList;
