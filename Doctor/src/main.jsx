import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import { DoctorProvider } from './context/DoctorContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DoctorProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DoctorProvider>
  </StrictMode>,
)
