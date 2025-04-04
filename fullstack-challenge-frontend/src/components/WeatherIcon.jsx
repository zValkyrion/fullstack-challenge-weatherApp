import React from 'react';
import PropTypes from 'prop-types';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiFog, WiThunderstorm } from 'react-icons/wi'; 

// --- Mapeo de códigos a iconos (EJEMPLO) ---
const iconMap = {
    '01d': WiDaySunny,
    '01n': WiDaySunny, 
    '02d': WiCloudy, 
    '02n': WiCloudy,
    '03d': WiCloudy, // scattered clouds
    '03n': WiCloudy,
    '04d': WiCloudy, // broken clouds
    '04n': WiCloudy,
    '09d': WiRain,   // shower rain
    '09n': WiRain,
    '10d': WiRain,   // rain
    '10n': WiRain,
    '11d': WiThunderstorm, // thunderstorm
    '11n': WiThunderstorm,
    '13d': WiSnow,   // snow
    '13n': WiSnow,
    '50d': WiFog,    // mist
    '50n': WiFog,
    // Añade más mapeos según necesites
};

export const WeatherIcon = ({ iconCode, size, colorClassName }) => {
    const IconComponent = iconCode ? iconMap[iconCode] : null;

    // Fallback si no hay icono o código
    if (!IconComponent) {
        return (
            <div
                className={`flex items-center justify-center w-[${size}px] h-[${size}px] bg-gray-300/30 rounded-full ${colorClassName || 'text-gray-500'}`} // Aplica color al fallback
                aria-label="Icono del clima no disponible"
            >
                 {/* Puedes poner un icono genérico de fallback si quieres */}
                 <WiCloudy className={`w-${Math.round(size * 0.6)} h-${Math.round(size * 0.6)}`} />
            </div>
        );
    }

    // Renderiza el icono mapeado, aplicando tamaño y la clase de color
    return (
        <IconComponent
             style={{ width: `${size}px`, height: `${size}px` }}
             className={`${colorClassName || 'text-slate-500'}`} 
             aria-hidden="true" 
        />
    );
};

// --- PropTypes para WeatherIcon ---
WeatherIcon.propTypes = {
    iconCode: PropTypes.string,
    size: PropTypes.number.isRequired,
    colorClassName: PropTypes.string, // Nueva prop para el color
};
