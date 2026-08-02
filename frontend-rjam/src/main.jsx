import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // <-- ESTA É A LINHA MÁGICA QUE PUXA O TAILWIND
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)