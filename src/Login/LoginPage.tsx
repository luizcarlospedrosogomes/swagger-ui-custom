import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './../swaggerLayout.css'
import { create, read } from '../services/api';
import { useSwaggerServer } from '../context/SwaggerServerContext';

import packageJson from '../../package.json'; // 
interface LoginPageProps {
  onLogin: (loginOk: boolean) => void;
}
const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { config, setConfig } = useSwaggerServer()
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectUrl = params.get('redirect') || '/';
  useEffect(() => {
  read('swagger-custom/swagger-custom-config.json')
    .then(setConfig)
    .catch(console.error);
}, []);

if (!config) return <div>Carregando...</div>;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Chama a API de login e recebe o token
      const response = await create( { path: config.loginUrl, data: JSON.stringify({ username, password })})
      const token = response.data.access_token; // supondo que a API retorne { token: '...' }

      sessionStorage.setItem('jwtToken', token);

      // Chama onLogin para atualizar o estado do App
      //onLogin(true);

      // Redireciona para o Swagger
      //navigate('/');
      onLogin(true, redirectUrl);
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      alert('Usuário ou senha inválidos');
    }
  };

  return (
    <div className='swagger-ui'>
    <div className="login-page">
      <h2>Login com usuario e senha do BTP</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            style={{ width: "100%"}}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            style={{ width: "100%"}}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button className="btn execute opblock-control__btn" type="submit">Entrar</button>
      </form>
      {/* 👇 aqui aparece a versão */}
        <p style={{ marginTop: "1rem", fontSize: "0.9em", color: "#666" }}>
          Versão: {packageJson.version}
        </p>
    </div>
    </div>
  );
};

export default LoginPage;
