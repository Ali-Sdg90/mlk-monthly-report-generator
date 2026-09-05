import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/vazirmatn/wght.css'
import App from './app/App'
import './styles/index.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
