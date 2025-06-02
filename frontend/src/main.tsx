import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // (1) AuthProviderをインポート

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* (2) AppコンポーネントをAuthProviderでラップ */ }
        <App/>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)