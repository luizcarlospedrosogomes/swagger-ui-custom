import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './swaggerLayout.css'
interface LoginPageProps {
  onLogin: (username: string,) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Chama a API de login e recebe o token
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }

      const data = await response.json();
      const token = data.token; // supondo que a API retorne { token: '...' }

      // Salva o token no localStorage
      localStorage.setItem('jwtToken', token);

      // Chama onLogin para atualizar o estado do App
      onLogin(username, token);

      // Redireciona para o Swagger
      navigate('/');
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      alert('Usuário ou senha inválidos');
    }
  };

  return (
    <div className='swagger-ui'>
    <div className=" login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button className="btn execute opblock-control__btn" type="submit">Entrar</button>
      </form>
    </div>
    </div>
  );
};

export default LoginPage;
