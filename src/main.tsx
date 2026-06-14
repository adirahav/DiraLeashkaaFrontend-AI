import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SplashProvider } from './context/SplashContext'
import { logger } from './utils/logger'
import './main.css'

logger.init()
console.log(`[VERSION] App started — env: ${import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE ?? 'unknown'}`)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SplashProvider>
      <App />
    </SplashProvider>
  </React.StrictMode>
)
