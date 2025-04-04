import React from 'react';

export const CityCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-5 animate-pulse">
            <div className="flex items-center justify-between mb-2">
                {/* Placeholder para Nombre Ciudad */}
                <div className="h-5 bg-gray-300 rounded w-3/5"></div>
            </div>
            <div className="flex items-center justify-around mt-4">
                {/* Placeholder para Icono */}
                <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4 space-y-2">
                    {/* Placeholder para Temperatura */}
                    <div className="h-8 bg-gray-300 rounded w-16"></div>
                    {/* Placeholder para Condición */}
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
};
