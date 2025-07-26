import React from 'react';
import { Helmet } from 'react-helmet';

const SobrePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Sobre | URLShort</title>
        <meta name="description" content="Conheça mais sobre o URLShort e como ajudamos a transformar links em ferramentas úteis." />
      </Helmet>

      <main className="content">
        <h1>Sobre o URLShort</h1>
        <p>
          O URLShort é uma plataforma moderna para encurtar URLs de forma rápida, segura e eficiente. 
          Criado com foco em simplicidade e desempenho, ajudamos pessoas e empresas a transformar links longos em URLs amigáveis e fáceis de compartilhar.
        </p>
        <p>
          Nossa missão é oferecer uma experiência intuitiva, com recursos poderosos como estatísticas em tempo real, gestão de links e proteção contra conteúdo malicioso.
        </p>
      </main>

      <style>{`
        .content {
          max-width: 800px;
          margin: 120px auto;
          padding: 2rem;
          color: #e0e7ff;
          font-family: 'Segoe UI', sans-serif;
          text-align: left;
        }

        .content h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #a78bfa;
        }

        .content p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #d1d5db;
        }
      `}</style>
    </>
  );
};

export default SobrePage;
