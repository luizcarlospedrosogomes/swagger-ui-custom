import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomSwagger from './CustomSwagger';
import LoginPage from './Login/LoginPage';
import 'swagger-ui-react/swagger-ui.css';

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

  const handleLogin = (loginOk: boolean) => {
    setToken(loginOk)
  };

   console.log('Token atual:', token);
  
  return (

      <Routes>
        {/* Swagger protegido */}
        <Route
          path="/"
          element={token ? <CustomSwagger /> : <Navigate to="/login" replace  />}
        />

        {/* Página de login */}
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />

        
      </Routes>
    
  );
}

export default App;
