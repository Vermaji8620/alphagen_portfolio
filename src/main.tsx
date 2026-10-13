import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AlphaGenProvider } from './context/AlphaGenContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AlphaGenProvider>
      <App />
    </AlphaGenProvider>
  </React.StrictMode>
);
