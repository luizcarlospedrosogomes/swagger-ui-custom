import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SwaggerServerProvider } from "./SwaggerServerContext";
import SwaggerLoader from "./SwaggerLoader";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <SwaggerServerProvider>
    <SwaggerLoader />
    <App />
  </SwaggerServerProvider>
  </StrictMode>,
)
