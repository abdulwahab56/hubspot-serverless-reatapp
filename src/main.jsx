import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConnectProvider } from './context/ConnectContext'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ConnectProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
      
    </ConnectProvider> 
  
  </BrowserRouter>
  ,
)
