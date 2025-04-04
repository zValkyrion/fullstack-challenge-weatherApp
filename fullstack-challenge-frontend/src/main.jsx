// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 
import { Toaster } from 'react-hot-toast'; 

// Crea una instancia de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos: Datos se consideran frescos por 5 mins
      cacheTime: 1000 * 60 * 30, // 30 minutos: Datos en caché se eliminan tras 30 mins de inactividad
      retry: 1, // Reintentar fetching 1 vez en caso de error
      refetchOnWindowFocus: false, // Opcional: Evita refetching solo por cambiar de ventana
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> {/* Envuelve todo con QueryClientProvider */}
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster position="top-right" /> {/* Posición de las notificaciones toast */}
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} /> {/* Añade las Devtools */}
    </QueryClientProvider>
  </React.StrictMode>,
);