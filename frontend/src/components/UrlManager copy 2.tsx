import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
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

type GeoEntry = {
  country: string;
  count: number;
};

type Props = {
  urls: Url[];
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57'];

export const UrlManager: React.FC<Props> = ({ urls }) => {
  const [expandedUrlId, setExpandedUrlId] = useState<number | null>(null);
  const [trafficData, setTrafficData] = useState<Record<number, TrafficEntry[]>>({});
  const [geoData, setGeoData] = useState<Record<number, GeoEntry[]>>({});
  const [loadingTraffic, setLoadingTraffic] = useState<number | null>(null);
  const [copiedUrlId, setCopiedUrlId] = useState<number | null>(null);

  const handleCopy = (urlId: number, shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedUrlId(urlId);
    setTimeout(() => setCopiedUrlId(null), 2000);
  };

  const fetchTrafficData = async (urlId: number) => {
    setLoadingTraffic(urlId);
    try {
      const res = await api.get(`/urls/${urlId}/traffic`, { withCredentials: true });
      const formatted = res.data.map((entry: any) => ({
        date: entry.date,
        count: entry.count,
      }));
      setTrafficData((prev) => ({ ...prev, [urlId]: formatted }));
    } catch (err) {
      console.error('Erro ao buscar dados de tráfego', err);
    } finally {
      setLoadingTraffic(null);
    }
  };

  const fetchGeoData = async (urlId: number) => {
    try {
      const res = await api.get(`/urls/${urlId}/geo`, { withCredentials: true });
      setGeoData((prev) => ({ ...prev, [urlId]: res.data }));
    } catch (err) {
      console.error('Erro ao buscar geolocalização', err);
    }
  };

  const handleToggle = (urlId: number) => {
    if (expandedUrlId === urlId) {
      setExpandedUrlId(null);
    } else {
      if (!trafficData[urlId]) fetchTrafficData(urlId);
      if (!geoData[urlId]) fetchGeoData(urlId);
      setExpandedUrlId(urlId);
    }
  };

  if (urls.length === 0) {
    return <p>Você ainda não criou nenhuma URL.</p>;
  }

  return (
    <div>
      <h2>Suas URLs (plano Free: 10 URLs)</h2>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {urls.map((url) => {
          const shortUrl = `http://localhost:4000/${url.slug}`;
          const isExpanded = expandedUrlId === url.id;
          const isLoading = loadingTraffic === url.id;
          const history = trafficData[url.id];
          const geo = geoData[url.id];

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
                <strong>Encurtada:</strong>{' '}
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  {shortUrl}
                </a>{' '}
                <button
                  onClick={() => handleCopy(url.id, shortUrl)}
                  style={{
                    marginLeft: 10,
                    padding: '2px 6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    backgroundColor: copiedUrlId === url.id ? '#10b981' : '#e5e7eb',
                    color: copiedUrlId === url.id ? 'white' : 'black',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                >
                  {copiedUrlId === url.id ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              <div className="texto"><strong>Original:</strong> {url.original}</div>
              <div><strong>Visitas totais:</strong> {url.visits}</div>
              <div><strong>Criada em:</strong> {new Date(url.createdAt).toLocaleString()}</div>

              <button
                style={{
                  marginTop: 10,
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => handleToggle(url.id)}
              >
                {isExpanded ? 'Ocultar tráfego' : isLoading ? 'Carregando...' : 'Ver tráfego'}
              </button>

              {isExpanded && history && (
                <div style={{ marginTop: '1rem', backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '6px' }}>
                  <h4>📊 Tráfego por dia</h4>
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

                  <h4 style={{ marginTop: '1.5rem' }}>🌍 Tráfego por país</h4>
                  {geo && geo.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={geo}
                          dataKey="count"
                          nameKey="country"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {geo.map((_, idx) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p>Sem dados de localização ainda.</p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};


//UrlManager