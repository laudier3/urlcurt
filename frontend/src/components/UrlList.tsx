import React, { useState } from 'react';
import { Alert } from "@mui/material";

type Url = {
  id: number;
  original: string;
  slug: string;
  visits: number;
  createdAt: string;
};

type Props = {
  urls: Url[];
};

const UrlList: React.FC<Props> = ({ urls }) => {
  const [copiedUrlId, setCopiedUrlId] = useState<number | null>(null);

  const handleCopy = (urlId: number, shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedUrlId(urlId);
    setTimeout(() => setCopiedUrlId(null), 2000);
  };

  if (urls.length === 0) {
    return <p>Você ainda não criou nenhuma URL.</p>;
  }

  return (
    <div>
      <h2>Suas URLs</h2>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {urls.map((url) => {
          const shortUrl = `https://urlcurt.site/${url.slug}`;

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
                  URL encurtada:{" "}
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
                    }}
                  >
                    {copiedUrlId === url.id ? 'Copiado...' : 'Copiar'}
                  </button>
                </Alert>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UrlList;
