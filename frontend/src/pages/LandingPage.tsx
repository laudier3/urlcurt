import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import ConsentFooter from './ConsentFooter';
import FeaturesSection from './FeaturesSection';
import FeaturesSection1 from './FeaturesSection1';
import FeaturesSection2 from './FeaturesSection';
import AboutSection from './AboutSection';
import CallToAction from './CallToAction';
import ArticlesSection from './ArticlesSection';
import { FloatingShare } from '../components/FloatingShare'; 
//import "./LoadingSpinner.css"


type Props = {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onSobreClick: () => void;
  onContatoClick: () => void;
};

const articlesMock = [
  {
    id: 1,
    title: 'Por que usar encurtadores de URL? Vantagens para negócios digitais',
    summary: 'Entenda como URLs curtas aumentam a confiança e a usabilidade nas suas campanhas.',
    url: 'https://blog.hubspot.com/marketing/'
  },
  {
    id: 2,
    title: 'Os benefícios do encurtamento de URLs para marketing digital',
    summary: 'Como links curtos ajudam a melhorar o engajamento e as métricas das campanhas.',
    url: 'https://neilpatel.com/blog/'
  },
  {
    id: 3,
    title: 'Como encurtar URLs pode melhorar a performance das suas campanhas',
    summary: 'Dicas para otimizar seus links e rastrear resultados com mais eficiência.',
    url: 'https://www.wordstream.com/blog/'
  },
  {
    id: 4,
    title: 'Marketing digital: estratégias para usar URLs curtas e personalizadas',
    summary: 'Torne seus links memoráveis e melhore a experiência do usuário.',
    url: 'https://sproutsocial.com/insights/'
  },
  {
    id: 5,
    title: 'A importância das URLs curtas para o SEO e a experiência do usuário',
    summary: 'Como URLs encurtadas influenciam o posicionamento e a navegação.',
    url: 'https://ahrefs.com/blog/'
  },
  {
    id: 6,
    title: 'Ferramentas de encurtamento de URLs e suas vantagens para o marketing',
    summary: 'Conheça as melhores plataformas para criar links curtos e rastrear cliques.',
    url: 'https://buffer.com/library/'
  },
  {
    id: 7,
    title: 'Como o uso de URLs curtas pode aumentar a taxa de cliques (CTR)',
    summary: 'Estudos e exemplos de sucesso com encurtadores de URL.',
    url: 'https://blog.hootsuite.com/'
  },
  {
    id: 8,
    title: 'Por que seu marketing digital precisa de links rastreáveis e curtos',
    summary: 'Controle e análise detalhada para otimizar campanhas.',
    url: 'https://www.socialmediaexaminer.com/'
  },
  {
    id: 9,
    title: 'O papel dos links curtos em campanhas de email marketing eficazes',
    summary: 'Melhore o design e a performance dos seus emails com URLs encurtadas.',
    url: 'https://emailonacid.com/blog/article/email-marketing/'
  },
  {
    id: 10,
    title: 'Como personalizar URLs para reforçar sua marca e aumentar a confiança',
    summary: 'Dicas para criar links que transmitam profissionalismo.',
    url: 'https://www.forbes.com/sites/forbescommunicationscouncil/'
  },
  {
    id: 11,
    title: 'Erros comuns ao usar encurtadores de URL em marketing digital',
    summary: 'Evite problemas que podem prejudicar suas campanhas e a reputação.',
    url: 'https://contentmarketinginstitute.com/2023/02/'
  },
  {
    id: 12,
    title: 'Tendências de marketing digital que envolvem o uso de URLs curtas',
    summary: 'Como as URLs encurtadas fazem parte das estratégias modernas.',
    url: 'https://www.singlegrain.com/digital-marketing/'
  },
];

const LandingPage: React.FC<Props> = ({ onLoginClick, onRegisterClick, onSobreClick, onContatoClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handler exemplo para login — você pode trocar para integração real
  const handleLogin = () => {
    setIsLoggedIn(true);
    onLoginClick();
  };

  // Handler para logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animationFrameId: number;
    let stars: { x: number; y: number; radius: number; alpha: number; delta: number }[] = [];

    const initStars = () => {
      stars = [];
      const starCount = 150;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2 + 0.3,
          alpha: Math.random(),
          delta: (Math.random() * 0.02) + 0.005,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f2027';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha.toFixed(2)})`;
        ctx.fill();

        star.alpha += star.delta;
        if (star.alpha <= 0) {
          star.alpha = 0;
          star.delta = -star.delta;
        } else if (star.alpha >= 1) {
          star.alpha = 1;
          star.delta = -star.delta;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  /*
  "encurtador de link", "encurtador de URL", 
  "Bitly", "TinyURL", "encurtar link grátis" e 
  "como encurtar URL". 
  */

  return (
    <>
      <Helmet>
        <title>encurtador de link | UrlCurt</title>
        <meta name="description" content="Transforme links longos em URLs curtas com segurança, praticidade e estatísticas em tempo real." />

        {/* Open Graph */}
        <meta property="og:title" content="Encurtador de URL | UrlCurt" />
        <meta property="og:description" content="Transforme links longos em URLs curtas com segurança, praticidade e estatísticas em tempo real." />
        <meta property="og:image" content="https://www.urlcurt.com.br/images/share-image.png" />
        <meta property="og:url" content="https://www.urlcurt.com.br" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Encurtador de Link | UrlCurt" />
        <meta name="twitter:description" content="Transforme links longos em URLs curtas com segurança, praticidade e estatísticas em tempo real." />
        <meta name="twitter:image" content="https://www.urlcurt.com.br/images/share-image.png" />

        <link rel="canonical" href="https://www.urlcurt.com.br/" />
      </Helmet>
      <canvas
        ref={canvasRef}
        className="background"
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          zIndex: -1,
          display: 'block',
        }}
      />

      <nav className="navbar" role="navigation" aria-label="Navegação principal">
        <div className="logo">Urlcurt</div>
        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
        >
          ☰
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {!isLoggedIn ? (
            <>
              <button onClick={onSobreClick} className="btn btn-login">Sobre</button>
              <button onClick={onContatoClick} className="btn btn-login">Contato</button>
              <button onClick={handleLogin} className="btn btn-login">Login</button>
              <button onClick={onRegisterClick} className="btn btn-register">Registrar</button>
            </>
          ) : (
            <>
              <button className="btn btn-user" title="Perfil">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#8b5cf6" aria-hidden="true">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zM12 14.4c-3.6 0-10.8 1.8-10.8 5.4v2.4h21.6v-2.4c0-3.6-7.2-5.4-10.8-5.4z" />
                </svg>
              </button>
              <button onClick={handleLogout} className="btn btn-logout">Logout</button>
            </>
          )}
        </div>
      </nav>
      <FloatingShare />
      <main className="hero">
        <h1>Encurte e Compartilhe URLs com Facilidade</h1>
        <p>
          Transforme links longos em URLs curtas, fáceis de compartilhar e acompanhar. 
          Aqui você também pode personalizar suas URLs, editá-las, acompanhar o tráfego detalhado que suas URLs personalizadas recebem, 
          incluindo as regiões de onde estão sendo mais acessadas, tudo isso com total segurança e controle.
        </p>
        
        <div className="hero-buttons">
          <button onClick={onRegisterClick} className="btn btn-primary">Comece Agora</button>
          <button onClick={onLoginClick} className="btn btn-secondary">Já Tenho Conta</button>
        </div>
      </main>

      <FeaturesSection />
      <FeaturesSection1 />
      <FeaturesSection2 />
      <AboutSection />
      <ArticlesSection articles={articlesMock} />

      <CallToAction onRegisterClick={onRegisterClick} />

      <footer className="footer" role="contentinfo">
        <small>
          © {new Date().getFullYear()} Urlcurt. Todos os direitos reservados. |{' '}
          <a href="/politica">Política de Privacidade</a>
        </small>
      </footer>

      <ConsentFooter />

      <style>{`
        canvas.background {
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(15, 32, 39, 0.85);
          backdrop-filter: blur(10px);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          color: #8b5cf6;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          letter-spacing: 2px;
        }
        .nav-links {
          display: flex;
          gap: 1rem;
        }
        .btn {
          padding: 0.5rem 1.2rem;
          font-size: 1rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
          font-weight: 600;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .btn-login {
          background: transparent;
          color: #8b5cf6;
          border: 2px solid #8b5cf6;
        }
        .btn-login:hover {
          background: #8b5cf6;
          color: white;
        }
        .btn-register {
          background: #8b5cf6;
          color: white;
        }
        .btn-register:hover {
          background: #7c3aed;
        }
        .hero {
          max-width: 700px;
          margin: 120px auto 40px auto;
          text-align: center;
          color: #e0e7ff;
          padding: 0 1rem;
        }
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          line-height: 1.1;
          font-weight: 800;
        }
        .hero p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          color: #c7d2fe;
          line-height: 1.5;
        }
        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
        }
        .btn-primary {
          background-color: #8b5cf6;
          color: white;
          padding: 0.75rem 2rem;
          font-size: 1.1rem;
          border-radius: 8px;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.5);
          margin: auto;
        }
        .btn-primary:hover {
          background-color: #7c3aed;
        }
        .btn-secondary {
          background-color: transparent;
          color: #8b5cf6;
          border: 2px solid #8b5cf6;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          box-shadow: none;
          margin: auto;
        }
        .btn-secondary:hover {
          background-color: #8b5cf6;
          color: white;
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.5);
        }

        .footer {
          text-align: center;
          padding: 2rem 1rem;
          color: #94a3b8;
          font-size: 0.9rem;
          margin-top: 3rem;
        }

        .footer a {
          color: #8b5cf6;
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .hero h1 {
            font-size: 2.2rem;
          }

          .hero p {
            font-size: 1rem;
          }

          .hero-buttons {
            flex-direction: column;
            gap: 0.8rem;
          }

          .nav-links {
            gap: 0.5rem;
          }

          .btn,
          .btn-primary,
          .btn-secondary {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
            width: 100%;
          }
          .hamburger {
            display: none;
            font-size: 1.8rem;
            background: transparent;
            border: none;
            color: #8b5cf6;
            cursor: pointer;
            z-index: 11;
          }

          @media (max-width: 768px) {
            .hamburger {
              display: block;
            }

            .nav-links {
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background: rgba(15, 32, 39, 0.95);
              display: none;
              flex-direction: column;
              align-items: center;
              gap: 1rem;
              padding: 1rem 0;
              transition: all 0.3s ease;
            }

            .nav-links.active {
              display: flex;
            }

            .btn {
              width: 90%;
              max-width: 250px;
            }
          }

        }
      `}</style>
    </>
  );
};

export default LandingPage;

