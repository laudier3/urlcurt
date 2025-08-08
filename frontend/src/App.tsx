// App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  
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
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
