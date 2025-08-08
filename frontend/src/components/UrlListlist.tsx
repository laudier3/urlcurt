import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import api from "../services/api";
import { GeoLocationStats } from "./GeoLocationStats";

type Url = { id: number; original: string; slug: string; visits: number; createdAt: string };
type TrafficEntry = { date: string; count: number };
type Props = { urls: Url[] };

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
      console.error("Erro ao buscar dados de tráfego", err);
    } finally {
      setLoadingTraffic(null);
    }
  };

   // ✅ Esta função deve estar DENTRO do componente e ANTES do return
  const buildChartOptions = (data: TrafficEntry[]) => {
    const options: ApexOptions = {
      chart: {
        type: "area",
        height: 260,
        zoom: { enabled: false },
        toolbar: { show: false },
        animations: {
          enabled: true,
          // easing: "easeinout", // <<< REMOVA ESSA LINHA
          speed: 800,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 350 },
        }

      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3, colors: ["#6366f1"] },
      xaxis: {
        type: "datetime",
        labels: {
          rotate: -45,
          style: { fontSize: "12px", colors: "#9ca3af" },
          datetimeFormatter: {
            day: "dd/MM",
            month: "MM/yyyy",
          },
        },
      },
      yaxis: {
        labels: { style: { fontSize: "12px", colors: "#9ca3af" } },
      },
      tooltip: {
        theme: "light",
        x: { format: "dd/MM/yyyy" },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.3,
          gradientToColors: ["#818cf8"],
          opacityFrom: 0.6,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      markers: {
        size: 4,
        colors: ["#6366f1"],
        strokeColors: "#fff", // <-- corrigido aqui
        strokeWidth: 2,
        hover: { size: 6 },
      },
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 4,
      },
      colors: ["#6366f1"],
    };

    const series = [{
      name: "Visitas",
      data: data.map((entry) => ({
        x: new Date(entry.date).getTime(),
        y: entry.count,
      })),
    }];

    return { options, series };
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

              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#1877F2', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>Facebook</a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shortUrl)}&text=${encodeURIComponent(url.original)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#1DA1F2', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>Twitter</a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shortUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#0077B5', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>LinkedIn</a>
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shortUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>WhatsApp</a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(shortUrl)}&text=${encodeURIComponent(url.original)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#0088cc', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>Telegram</a>
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

              <br /><br />

              <div><strong>Original:</strong>{' '}
                <a href={url.original} target="_blank" rel="noopener noreferrer">{url.original}</a>
              </div>

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
                  <div style={{ overflowX: "auto" }}>
                    <ReactApexChart
                      options={buildChartOptions(history)}
                      series={buildChartOptions(history).series}
                      type="area"
                      height={260}
                    />
                  </div>
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
