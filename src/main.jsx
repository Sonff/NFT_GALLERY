import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { Web3Provider } from './context/Web3Context';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Web3Provider>
        <AuthProvider>
          <App />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#161C2A',
                color: '#F3F4F6',
                borderRadius: '16px',
                border: '1px solid rgba(34, 43, 63, 0.5)'
              },
              success: {
                iconTheme: {
                  primary: '#8b5cf6',
                  secondary: '#F3F4F6',
                },
              },
            }}
          />
        </AuthProvider>
      </Web3Provider>
    </ThemeProvider>
  </React.StrictMode>
);
