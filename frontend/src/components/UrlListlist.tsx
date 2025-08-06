import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts";
import api from "../services/api";
import { GeoLocationStats } from "./GeoLocationStats";

type Url = { id: number; original: string; slug: string; visits: number; createdAt: string };
type TrafficEntry = { date: string; count: number };
type Props = { urls: Url[] };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        padding: "8px 12px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontSize: 14,
      }}>
        <div><strong>{new Date(label).toLocaleDateString("pt-BR")}</strong></div>
        <div>Visitas: {payload[0].value}</div>
      </div>
    );
  }
  return null;
};

export const UrlListlist: React.FC<Props> = ({ urls }) => {
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
    setLoadingTraffic(urlId);
    try {
      const res = await api.get<TrafficEntry[]>(`/api/urls/${urlId}/traffic`, { withCredentials: true });
      setTrafficData((prev) => ({ ...prev, [urlId]: res.data }));
      setExpandedUrlId(urlId);
    } catch (err) {
      console.error("Erro fetching traffic", err);
    } finally {
      setLoadingTraffic(null);
    }
  };

  if (urls.length === 0) return <p>Você ainda não criou nenhuma URL.</p>;

  return (
    <div>
      <h2>Suas URLs no plano Free</h2>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {urls.map((url) => {
          const shortUrl = `https://urlcurt.site/${url.slug}`;
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
                <strong>Encurtada:</strong>{' '}
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  {shortUrl}
                </a>
              </div>

              {/* Botões de compartilhamento e copiar */}
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}&display=popup`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    fontSize: 12,
                    background: '#1877F2',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}
                >
                  Facebook
                </a>

                {/* Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shortUrl)}&text=${encodeURIComponent(url.original)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    fontSize: 12,
                    background: '#1DA1F2',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}
                >
                  Twitter
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shortUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    fontSize: 12,
                    background: '#0077B5',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}
                >
                  LinkedIn
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shortUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    fontSize: 12,
                    background: '#25D366',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}
                >
                  WhatsApp
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shortUrl)}&text=${encodeURIComponent(url.original)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    fontSize: 12,
                    background: '#0088cc',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}
                >
                  Telegram
                </a>

                {/* Instagram - abre perfil (não tem share direto) */}
                {/*<a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    fontSize: 12,
                    background: '#C13584',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}
                  title="Instagram não tem compartilhamento direto para links"
                >
                  Instagram
                </a>*/}
              </div>
              <br />
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
              <br />
              <br />
              <div className="textos">
                <strong>Original:</strong>{' '}
                <a href={url.original} target="_blank" rel="noopener noreferrer">
                  {url.original}
                </a>
              </div>

              <div>
                <strong>Visitas totais:</strong> {url.visits}
              </div>

              <div>
                <strong>Criada em:</strong> {new Date(url.createdAt).toLocaleString()}
              </div>

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
                onClick={() => {
                  if (isExpanded) {
                    setExpandedUrlId(null);
                  } else if (!trafficData[url.id]) {
                    fetchTrafficData(url.id);
                  } else {
                    setExpandedUrlId(url.id);
                  }
                }}
              >
                {isExpanded ? 'Ocultar tráfego' : isLoading ? 'Carregando...' : 'Ver tráfego'}
              </button>

              {isExpanded && history && (
                <div style={{ marginTop: "1rem", backgroundColor: "#f4f4f4", padding: 10, borderRadius: 6 }}>
                  <h4>Tráfego nos últimos dias</h4>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={history} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="10%" stopColor="#4f46e5" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString("pt-BR", {
                          day: "2-digit", month: "2-digit",
                        })}
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={false} tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={false} tickLine={false}
                        width={40}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#4f46e5"
                        fill="url(#colorVisits)"
                        strokeWidth={2.5}
                        dot={{ r: 3, stroke: "#4f46e5", strokeWidth: 1, fill: "#fff" }}
                        activeDot={{ r: 6, stroke: "#4f46e5", strokeWidth: 2, fill: "#fff" }}
                      />
                      <Brush dataKey="date" height={30} stroke="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <GeoLocationStats urlId={url.id} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
