// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css' 

// --- PWA Service Worker Registration ---
import { registerSW } from 'virtual:pwa-register'

// యాప్‌లో కొత్త అప్‌డేట్ వస్తే వెంటనే రిజిస్టర్ అవుతుంది
registerSW({ immediate: true })
// ---------------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>
)