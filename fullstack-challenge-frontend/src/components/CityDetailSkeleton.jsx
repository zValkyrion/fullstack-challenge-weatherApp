// src/components/CityDetailSkeleton.jsx
import React from 'react';

export const CityDetailSkeleton = () => {
  return (
    // Contenedor principal con animación de pulso y espaciado vertical
    <div className="animate-pulse w-full space-y-6">

      {/* Placeholder para el Título Principal (Nombre de la Ciudad) */}
      <div className="h-9 bg-gray-300 rounded-md w-3/4"></div>

      {/* Placeholder para la Ubicación (Región, País) */}
      <div className="h-6 bg-gray-300 rounded-md w-1/2 mb-6"></div>

      {/* Placeholder para el Bloque Principal del Clima */}
      <div className="bg-gray-300 p-6 rounded-lg w-full">
        {/* Parte superior del bloque: Nombre pequeño, fecha, icono grande, temperatura */}
        <div className="flex justify-between items-start mb-6">
          {/* Lado izquierdo: Nombre pequeño y fecha */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-400 rounded w-32"></div> {/* Placeholder nombre ciudad */}
            <div className="h-4 bg-gray-400 rounded w-24"></div> {/* Placeholder fecha */}
          </div>
          {/* Lado derecho: Icono y Temperatura */}
          <div className="flex items-center">
             {/* Placeholder para el icono del clima */}
             <div className="h-14 w-14 bg-gray-400 rounded-full mr-3"></div>
             {/* Placeholder para la temperatura grande */}
             <div className="h-12 bg-gray-400 rounded w-24"></div>
          </div>
        </div>

         {/* Placeholder para la Grid de Detalles del Clima (Sensación, Humedad, etc.) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-400/50">
          {/* Repite un bloque para cada tarjeta de detalle */}
          <div className="bg-gray-400/60 p-3 rounded-md h-20"></div> {/* Card 1 */}
          <div className="bg-gray-400/60 p-3 rounded-md h-20"></div> {/* Card 2 */}
          <div className="bg-gray-400/60 p-3 rounded-md h-20"></div> {/* Card 3 */}
          <div className="bg-gray-400/60 p-3 rounded-md h-20"></div> {/* Card 4 */}
        </div>
      </div>

      {/* Opcional: Placeholder para secciones adicionales si las tienes */}
      {/* <div className="bg-gray-300 rounded-lg h-40 w-full"></div> */}

    </div>
  );
};