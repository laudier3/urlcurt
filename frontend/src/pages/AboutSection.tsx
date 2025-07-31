import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="about-section">
      <div className="about-content">
        <h2>O que é um encurtador de URL?</h2>
        <p>
          Um encurtador de URL transforma links longos e difíceis de lembrar em versões curtas e limpas, ideais para compartilhar em redes sociais, campanhas de marketing e outras plataformas. 
        </p>
        <p>
          Além de facilitar a divulgação, você obtém dados valiosos sobre o desempenho de cada link compartilhado.
        </p>
      </div>

      <style>{`
        .about-section {
          max-width: 800px;
          margin: 4rem auto;
          padding: 0 1.5rem;
          color: #e0e7ff;
          text-align: center;
        }

        .about-content h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #a78bfa;
        }

        .about-content p {
          font-size: 1.1rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
