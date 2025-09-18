import React from 'react';
import CustomSwagger from './CustomSwagger';
import './App.css';
import 'swagger-ui-react/swagger-ui.css'; 
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Minha API Documentation</h1>
        <p>Documentação interativa com layout personalizado</p>
      </header>
      
      <main>
        <CustomSwagger />
      </main>
    </div>
  );
}

export default App;