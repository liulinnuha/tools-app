import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ToolsProvider } from './components/tools/ToolRenderer.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToolsProvider>
      <App />
    </ToolsProvider>
  </React.StrictMode>,
)
