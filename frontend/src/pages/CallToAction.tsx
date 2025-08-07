import React from 'react';

const CallToAction: React.FC<{ onRegisterClick: () => void }> = ({ onRegisterClick }) => {
  
  return (
    <section className="cta-section">
      <h2>Pronto para transformar seus links?</h2>
      <p>Crie sua conta agora mesmo e comece a encurtar URLs com praticidade e segurança.</p>
      <button className="btn btn-primary" onClick={onRegisterClick}>Criar Conta</button>

      <style>{`
        .cta-section {
          text-align: center;
          margin: 5rem auto 3rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          max-width: 700px;
        }

        .cta-section h2 {
          font-size: 1.8rem;
          color: #a78bfa;
          margin-bottom: 1rem;
        }

        .cta-section p {
          font-size: 1.1rem;
          color: #cbd5e1;
          margin-bottom: 1.5rem;
        }

        .cta-section .btn {
          font-size: 1.1rem;
          padding: 0.75rem 2rem;
        }
      `}</style>
    </section>
  );
};

export default CallToAction;
