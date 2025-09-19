import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomSwagger from './CustomSwagger';
import LoginPage from './LoginPage';
import 'swagger-ui-react/swagger-ui.css';

export function App() {
  const [token, setToken] = useState<string | null>(null);

  // Verifica se existe um token JWT no localStorage ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem('jwtToken'); // ou o nome que você usa
    if (token) {
      console.log("token", token)
      // Aqui você pode decodificar o token se quiser pegar o username ou apenas assumir que está logado
      setToken(token); // substitua por algo do token se necessário
    }
  }, []);

  const handleLogin = (token: string) => {
    setToken(token)
    
  };

  return (
    <Router>
      <Routes>
        {/* Página de login */}
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />

        {/* Swagger protegido */}
        <Route
          path="/"
          element={token ? <CustomSwagger /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
