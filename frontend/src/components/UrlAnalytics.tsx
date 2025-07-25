import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';
import axios from 'axios';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57'];

interface Props {
  urlId: number;
}

interface TrafficEntry {
  date: string;
  count: number;
}

interface GeoEntry {
  country: string;
  count: number;
}

export const UrlAnalytics: React.FC<Props> = ({ urlId }) => {
  const [traffic, setTraffic] = useState<TrafficEntry[]>([]);
  const [geo, setGeo] = useState<GeoEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [trafficRes, geoRes] = await Promise.all([
          axios.get<TrafficEntry[]>(`/api/urls/${urlId}/traffic`, { withCredentials: true }),
          axios.get<GeoEntry[]>(`/api/urls/${urlId}/geo`, { withCredentials: true }),
        ]);
        setTraffic(trafficRes.data);
        setGeo(geoRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados de análise", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [urlId]);

  if (loading) return <p>Carregando dados de análise...</p>;

  return (
    <div style={{ marginTop: '1rem', backgroundColor: '#f9f9f9', padding: 20, borderRadius: 8 }}>
      <h4>📈 Tráfego diário</h4>
      {traffic.length === 0 ? (
        <p>Nenhum dado de tráfego ainda.</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={traffic}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#4f46e5" />
          </LineChart>
        </ResponsiveContainer>
      )}

      <h4 style={{ marginTop: '1.5rem' }}>🌍 Tráfego por localização</h4>
      {geo.length === 0 ? (
        <p>Nenhum dado de geolocalização ainda.</p>
      ) : (
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
              {geo.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
