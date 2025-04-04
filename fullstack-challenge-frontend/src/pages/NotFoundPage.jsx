// src/pages/NotFoundPage.jsx

import React from 'react';
import { Link } from 'react-router-dom'; 
import { FiCloudOff } from 'react-icons/fi'; 
import { Button } from '../components/Button'; 

function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center px-4 text-slate-600">
      {/* Contenedor principal con centrado y altura mínima */}

      {/* Icono Temático */}
      <FiCloudOff className="text-8xl text-slate-400 mb-6 opacity-70" />

      {/* Título Principal */}
      <h1 className="text-4xl font-bold text-slate-700 mb-3">
        ¡Ups! Página Perdida en la Niebla
      </h1>

      {/* Texto Descriptivo */}
      <p className="text-lg text-slate-500 mb-8 max-w-md">
        Parece que la dirección que buscas se ha desvanecido entre las nubes.
        No pudimos encontrarla (Error 404).
      </p>

      {/* Número 404 Grande (opcional, más sutil) */}
       <p className="text-7xl font-bold text-slate-300 opacity-50 mb-8">
         404
       </p>

      {/* Botón para Volver */}
      <Link to="/">
        <Button variant="primary" size="lg"> {/* Puedes ajustar variant/size */}
          Volver al Inicio (Clima Seguro)
        </Button>
      </Link>

    </div>
  );
}

export default NotFoundPage;
