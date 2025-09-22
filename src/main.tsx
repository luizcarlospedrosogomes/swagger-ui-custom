import { StrictMode } from 'react'
import { HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SwaggerServerProvider } from "./context/SwaggerServerContext.tsx";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <SwaggerServerProvider>
    <HashRouter basename="/swagger-custom">
      <App />
    </HashRouter>
  </SwaggerServerProvider>
  </StrictMode>,
)
