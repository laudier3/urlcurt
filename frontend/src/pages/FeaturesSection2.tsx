import React from 'react';

const FeaturesSection2: React.FC = () => {
  
  return (
    <section className="features-section">
     {/*<h2>Por que escolher o Urlcurt para suas URLs?</h2>*/}
      <div className="features">
        <div className="feature">
          <h3>🎯 Links otimizados para conversão</h3>
          <p>
            URLs curtas são visualmente mais limpas, aumentando a confiança do usuário e melhorando taxas de clique.
          </p>
        </div>
        <div className="feature">
          <h3>📱 Acompanhamento completo em qualquer dispositivo</h3>
          <p>
            Veja relatórios precisos de acessos em desktop, mobile ou tablet, para entender melhor seu público.
          </p>
        </div>
        <div className="feature">
          <h3>🔒 Controle total sobre seus links</h3>
          <p>
            Personalize redirecionamentos, proteja links com senha e evite acessos não autorizados.
          </p>
        </div>
        <div className="feature">
          <h3>⚡ Agilidade e praticidade na criação</h3>
          <p>
            Encurte URLs em segundos, sem complicação, e compartilhe rapidamente em qualquer canal.
          </p>
        </div>
        <div className="feature">
          <h3>⚡ Integração e automação</h3>
          <p>
            Ferramentas que facilitam integrar o encurtador com outras plataformas e automatizar suas campanhas digitais.
          </p>
        </div>
        <div className="feature">
          <h3>⚙️ Fácil de usar</h3>
          <p>
            Interface simples, intuitiva e pronta para você começar a encurtar e compartilhar.
          </p>
        </div>
      </div>

      <style>{`
        .features-section {
          max-width: 1000px;
          margin: 4rem auto;
          padding: 0 1.5rem;
          color: #e0e7ff;
        }

        .features-section h2 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          backdrop-filter: blur(6px);
        }

        .feature h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: #a78bfa;
        }

        .feature p {
          font-size: 1rem;
          line-height: 1.5;
          color: #cbd5e1;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection2;
