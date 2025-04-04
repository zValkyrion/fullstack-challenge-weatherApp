// src/components/ForecastItem.jsx
import React from 'react';
import { WeatherIcon } from './WeatherIcon';
import { format } from 'date-fns'; // Para formatear fechas (instala date-fns: npm install date-fns)
import { es } from 'date-fns/locale'; // Para formato en español

export const ForecastItem = ({ date, temp_min, temp_max, condition, icon }) => {
    // Formatea la fecha. Asegúrate de que la fecha es un objeto Date o un string ISO válido.
    // OpenWeather usualmente devuelve strings 'YYYY-MM-DD HH:MM:SS' o timestamps.
    // El backend ya lo procesó a 'YYYY-MM-DD'. Añadimos la hora para que Date lo parse bien.
    const dateObject = new Date(`${date}T12:00:00`); // Añade hora para evitar problemas de zona horaria al formatear solo día/mes

    const formattedDate = isValid(dateObject)
        ? format(dateObject, 'EEEE d', { locale: es }) // Ej: "martes 5"
        : 'Fecha inválida';
    const formattedDayShort = isValid(dateObject)
        ? format(dateObject, 'eee', { locale: es }) // Ej: "mar."
        : '---';


    // Helper para validar fechas
    function isValid(date) {
        return date instanceof Date && !isNaN(date);
    }


    return (
        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg shadow-sm hover:bg-white/80 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row items-center text-left space-x-0 sm:space-x-3 w-1/3">
                <span className="font-semibold text-sm sm:text-base capitalize">{formattedDate}</span>
                {/* <span className="text-xs text-gray-500 sm:hidden">({formattedDayShort})</span> */}
            </div>
            <div className="flex items-center justify-center space-x-2 w-1/3 text-center">
                <WeatherIcon iconCode={icon} size={32} className="text-primary" />
                <span className="text-xs sm:text-sm text-gray-600 capitalize hidden sm:inline">{condition || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-end space-x-1 w-1/3 text-right">
                <span className="text-sm sm:text-base font-semibold text-gray-800">{Math.round(temp_max)}°</span>
                <span className="text-xs sm:text-sm text-gray-500">/ {Math.round(temp_min)}°</span>
            </div>
        </div>
    );
};