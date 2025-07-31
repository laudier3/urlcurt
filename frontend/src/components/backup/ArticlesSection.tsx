import React from 'react';

type Article = {
  id: number;
  title: string;
  summary: string;
  url: string;
};

type Props = {
  articles: Article[];
};

const ArticlesSection: React.FC<Props> = ({ articles }) => {
  return (
    <section style={{ maxWidth: 900, margin: '3rem auto', padding: '0 1rem', color: '#e0e7ff' }}>
      <h2 style={{ color: '#8b5cf6', marginBottom: '1.5rem' }}>Últimos Artigos</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
      }}>
        {articles.map(({ id, title, summary, url }) => (
          <article key={id} style={{
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '160px',
          }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>{title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#d8dbf1', lineHeight: '1.3' }}>{summary}</p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: '1rem',
                fontWeight: '600',
                color: '#8b5cf6',
                textDecoration: 'underline',
                alignSelf: 'flex-start',
                fontSize: '0.9rem',
              }}
            >
              Leia mais →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ArticlesSection;
