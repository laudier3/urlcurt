import React from 'react';

const FeaturesSection1: React.FC = () => {

  /*useEffect(() => {
    const d = document;
    const s = d.createElement('script');
    const l = d.scripts[d.scripts.length - 1];

    (s as any).settings = {};
    s.src = "//probableregret.com/bwXOV.stdhGEl-0GYbWBch/teZmk9AuQZLUblpkOPlTkYr1kNsjuk/0zN/jGcbtYNYj/Uf2MOmThQV2MOgAC";
    s.async = true;
    s.referrerPolicy = 'no-referrer-when-downgrade';

    l.parentNode?.insertBefore(s, l);

    return () => {
      s.remove();
    };
  }, []);*/


  return (
    <section className="features-section">
      {/*<h2>Por que escolher o Urlcurt para suas URLs?</h2>*/}
      <div className="features">
        <div className="feature">
          <h3>🚀 Melhore o engajamento</h3>
          <p>
            Links curtos são mais atraentes e fáceis de clicar, aumentando as chances de interação com seu público.
          </p>
        </div>
        <div className="feature">
          <h3>📊 Monitoramento detalhado</h3>
          <p>
            Saiba exatamente como, quando e onde seus links estão sendo acessados para ajustar suas estratégias.
          </p>
        </div>
        <div className="feature">
          <h3>🔐 Proteção contra spam e abusos</h3>
          <p>
            Garantimos que seus links sejam seguros e livres de ameaças, protegendo seus visitantes e sua reputação.
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

export default FeaturesSection1;
