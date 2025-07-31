// App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';
import Loading from './components/Loading';

const App: React.FC = () => {
  //const { loading } = useAuth();
  //if (loading) return <Loading/>;

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
