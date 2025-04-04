// src/App.jsx

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- Importaciones de Páginas y Componentes Reales ---
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CityDetailPage } from './pages/CityDetailPage';
import NotFoundPage from './pages/NotFoundPage'; // <-- Ya está importado, ¡bien!


// Importa componentes de layout y protección
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';


function App() {

  const location = useLocation();

  return (
    // Contenedor principal de la aplicación con Flexbox para el layout (header/main/footer)
    // y estilos base de fondo/texto aplicados en index.css
    <div className="App flex flex-col min-h-screen bg-slate-100 text-slate-800">
      {/* Navbar persistente en la parte superior */}
      <Navbar />

      {/* Contenido principal que crece para llenar el espacio */}
      {/* El padding y container se aplican aquí para que el contenido de las páginas esté centrado y espaciado */}
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {/* AnimatePresence envuelve Routes para habilitar animaciones de salida/entrada entre cambios de ruta */}
        <AnimatePresence mode="wait">
          {/* Usamos location.pathname como key para que AnimatePresence detecte cambios de ruta correctamente */}
          <Routes location={location} key={location.pathname}>

            {/* --- Rutas Públicas --- */}
            {/* Ruta para la página de inicio de sesión */}
            <Route path="/login" element={<LoginPage />} />
            {/* Ruta para la página de registro */}
            <Route path="/signup" element={<SignupPage />} />

            {/* --- Rutas Protegidas --- */}
            {/* Ruta raíz (Home): Muestra HomePage si el usuario está autenticado */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            {/* Ruta dinámica para detalles de ciudad: Muestra CityDetailPage si está autenticado */}
            <Route
              path="/city/:lat/:lon" // Espera latitud y longitud como parámetros en la URL
              element={
                <ProtectedRoute>
                  <CityDetailPage />
                </ProtectedRoute>
              }
            />

            {/* --- Ruta Catch-all (404) --- */}
            {/* Se muestra si ninguna de las rutas anteriores coincide */}
            {/* --- CAMBIO AQUÍ: Usamos el componente NotFoundPage --- */}
            <Route path="*" element={<NotFoundPage />} />
            {/* ------------------------------------------------------- */}
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer simple al final de la página */}
      <footer className="text-center text-xs text-gray-500 p-4 mt-auto">
            WeatherApp Carlos Acosta © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;