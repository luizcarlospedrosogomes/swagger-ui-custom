import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CustomSwagger from './CustomSwagger';
import LoginPage from './Login/LoginPage';
import 'swagger-ui-react/swagger-ui.css';

const ProtectedRoute = ({ token, children }: { token: boolean; children: JSX.Element }) => {
  const location = useLocation();
  if (!token) {
    // redireciona para login e salva a URL original
     const fullUrl = window.location.href;
    return <Navigate to={`/login?redirect=${encodeURIComponent(fullUrl)}`} replace />;
  }
  return children;
};

export function App() {
  const [token, setToken] = useState<boolean>(
    () => !!localStorage.getItem('jwtToken')
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken'); // ou o nome que você usa
    if (storedToken) {
      setToken(true); // substitua por algo do token se necessário
    }
  }, []);

  const handleLogin = (loginOk: boolean,  redirectUrl?: string) => {
    setToken(loginOk)
     if (loginOk && redirectUrl) {
      window.location.href = redirectUrl; // redireciona para a URL original
    }
  };


  return (

    <Routes>
      {/* Swagger protegido */}
      <Route path="/" element={
            <ProtectedRoute token={token}>
              <CustomSwagger />
            </ProtectedRoute>
          }/>
      {/* Página de login */}
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      <Route
          path="/endpoint/:path/*"
          element={
            <ProtectedRoute token={token}>
              <CustomSwagger />
            </ProtectedRoute>
          }
        />


    </Routes>

  );
}

export default App;
