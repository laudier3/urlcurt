import React, { useEffect, useRef } from 'react';
import ConsentFooter from './ConsentFooter';

type Props = {
  onLoginClick: () => void;
  onRegisterClick: () => void;
};

const LandingPage: React.FC<Props> = ({ onLoginClick, onRegisterClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

        // pulsar efeito
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

  return (
    <>
      {/* Canvas ocupa todo o background, posicionado atrás */}
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
      <nav className="navbar">
        <div className="logo">URLShort</div>
        <div className="nav-links">
          <button onClick={onLoginClick} className="btn btn-login">
            Login
          </button>
          <button onClick={onRegisterClick} className="btn btn-register">
            Registrar
          </button>
        </div>
      </nav>

      <main className="hero">
        <h1>Encurte e Compartilhe URLs com Facilidade</h1>
        <p>
          Transforme links longos em URLs curtas, fáceis de compartilhar e acompanhar. 
          Acompanhe estatísticas e gerencie suas URLs com segurança.
        </p>
        <div className="hero-buttons">
          <button onClick={onRegisterClick} className="btn btn-primary">
            Comece Agora
          </button>
          <button onClick={onLoginClick} className="btn btn-secondary">
            Já Tenho Conta
          </button>
        </div>
      </main>

      <style>{`
        /* Mantém seu gradiente escuro original para o canvas ficar mais bonito */
        canvas.background {
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        }
        
        /* Navbar e outros estilos mantidos iguais */
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
          cursor: default;
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
        }
        .btn-secondary:hover {
          background-color: #8b5cf6;
          color: white;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.5);
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
          .btn, .btn-primary, .btn-secondary {
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
          }
        }
      `}</style>
      <ConsentFooter />
    </>
  );
};

export default LandingPage;
