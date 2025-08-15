// App.tsx
import React, { useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useRef } from 'react';
import { Helmet } from 'react-helmet';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const s = document.createElement('script');
    s.src = "//probableregret.com/bMX.V/sidaGil/0PYBWVcK/AeAm/9CuYZDUql/kPP/TYYK1bN/jMkW2zM-zyYYtjNujNUL2QO/TCYlz/NpwK";
    s.async = true;
    s.referrerPolicy = 'no-referrer-when-downgrade';

    const currentScript = document.scripts[document.scripts.length - 1];
    currentScript.parentNode?.insertBefore(s, currentScript);

    return () => {
      // Remove o script quando o componente for desmontado (boa prática)
      s.remove();
    };
  }, []);

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
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
};

export default App;
