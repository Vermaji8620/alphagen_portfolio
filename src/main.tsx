import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AlphaGenProvider } from './context/AlphaGenContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AlphaGenProvider>
        <App />
      </AlphaGenProvider>
    </AuthProvider>
  </React.StrictMode>
);
