// src/components/ForecastSkeleton.jsx
import React from 'react';

export const ForecastSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-200 rounded-lg shadow-sm animate-pulse h-[60px]"> {/* Altura fija */}
      <div className="flex items-center space-x-3 w-1/3">
        {/* Placeholder Fecha */}
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>
      <div className="flex items-center justify-center space-x-2 w-1/3">
         {/* Placeholder Icono */}
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        {/* Placeholder Condición (opcional) */}
         <div className="h-4 bg-gray-300 rounded w-16 hidden sm:block"></div>
      </div>
      <div className="flex items-center justify-end space-x-1 w-1/3">
        {/* Placeholder Temps */}
        <div className="h-5 bg-gray-300 rounded w-12"></div>
      </div>
    </div>
  );
};