// src/components/CityCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { WeatherIcon } from './WeatherIcon'; // Asegúrate que este componente acepte 'colorClassName'
import { FiMapPin } from 'react-icons/fi';

// --- Helper Function para Determinar Clases (Gradiente, Texto, Iconos) ---
const COLD_THRESHOLD = 10; // <= 10°C es frío
const HOT_THRESHOLD = 26;  // >= 26°C es caliente

// Define las clases de color para los iconos
const ICON_VERY_COLD_CLASS = 'text-blue-400';
const ICON_COLD_CLASS = 'text-sky-300';
const ICON_COOL_CLASS = 'text-cyan-300';
const ICON_MILD_CLASS = 'text-blue-300';
const ICON_WARM_CLASS = 'text-orange-300';
const ICON_HOT_CLASS = 'text-rose-300';

const getTemperatureClasses = (temp) => {
  const baseTextColor = 'text-slate-700';
  let gradientClass = '';
  let iconClass = '';

  if (typeof temp !== 'number' || isNaN(temp)) {
    gradientClass = `bg-gradient-to-br from-gray-100 via-gray-50 to-white ${baseTextColor}`;
    iconClass = ICON_MILD_CLASS;
  } else if (temp <= -5) {
    // Muy frío
    gradientClass = `bg-gradient-to-br from-blue-400 via-blue-200 to-blue-100 ${baseTextColor}`;
    iconClass = ICON_VERY_COLD_CLASS;
  } else if (temp <= 5) {
    // Frío
    gradientClass = `bg-gradient-to-br from-sky-300 via-sky-200 to-sky-100 ${baseTextColor}`;
    iconClass = ICON_COLD_CLASS;
  } else if (temp <= 12) {
    // Fresco
    gradientClass = `bg-gradient-to-br from-cyan-300 via-cyan-200 to-cyan-100 ${baseTextColor}`;
    iconClass = ICON_COOL_CLASS;
  } else if (temp <= 20) {
    // Templado
    gradientClass = `bg-gradient-to-br from-blue-300 via-sky-200 to-blue-100 ${baseTextColor}`;
    iconClass = ICON_MILD_CLASS;
  } else if (temp <= 28) {
    // Cálido
    gradientClass = `bg-gradient-to-br from-orange-100 via-amber-200 to-amber-100 ${baseTextColor}`;
    iconClass = ICON_WARM_CLASS;
  } else {
    // Caliente
    gradientClass = `bg-gradient-to-br from-red-300 via-rose-200 to-rose-100 ${baseTextColor}`;
    iconClass = ICON_HOT_CLASS;
  }

  return { gradientClass, iconClass };
};


// --- Variantes de Animación ---
const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: { duration: 0.2, ease: "easeIn" }
    },
};

// --- Componente CityCard ---
export const CityCard = ({ cityName, temp, condition, iconCode, lat, lon, country }) => {
    const isClickable = lat != null && lon != null;
    const linkTo = isClickable ? `/city/${lat}/${lon}` : '#';

    // Obtener clases de gradiente, texto base e icono del helper
    const { gradientClass, iconClass } = getTemperatureClasses(temp);

    // Color para texto secundario (condición) - consistentemente gris claro
    const secondaryTextColorClass = 'text-gray-500';

    // Formatear temperatura para mostrar
    const temperatureDisplay = (typeof temp === 'number' && !isNaN(temp))
        ? `${Math.round(temp)}°C`
        : '--°C';

    // --- JSX para el Contenido Interno de la Tarjeta ---
    const cardContent = (
        <div className="flex flex-col justify-between h-full"> {/* Distribución vertical */}
            {/* Sección Superior: Nombre */}
            <div className="mb-2">
                 {/* El color del texto del título viene de 'gradientClass' */}
                <h3 className={`text-lg font-semibold flex items-center`}>
                    {/* Aplicar color de icono a FiMapPin */}
                    <FiMapPin className={`mr-2 flex-shrink-0 ${iconClass}`} aria-hidden="true"/>
                    <span className="truncate">{cityName}</span> {/* Evita desbordamiento */}
                </h3>
            </div>

            {/* Sección Inferior: Clima */}
            <div className="flex items-center justify-between mt-4">
                {/* Icono y Condición */}
                <div className="flex flex-col items-center text-center w-1/2 pr-2"> {/* Ajusta ancho si es necesario */}
                   <div className="w-12 h-12 mb-1"> {/* Contenedor de icono */}
                       {iconCode ? (
                            <WeatherIcon
                                iconCode={iconCode}
                                size={48}
                                colorClassName={iconClass} // Pasa la clase de color del icono
                            />
                        ) : (
                            // Placeholder si no hay iconCode
                            <div className={`w-12 h-12 bg-gray-300/30 rounded-full flex items-center justify-center ${iconClass}`}>
                                <FiMapPin/> {/* Icono genérico como fallback */}
                            </div>
                        )}
                    </div>
                    {/* Texto de condición con color secundario */}
                    <p className={`text-xs capitalize truncate ${secondaryTextColorClass}`}>
                        {condition || 'N/A'}
                    </p>
                </div>

                {/* Temperatura */}
                <div className="text-right w-1/2 pl-2"> {/* Ajusta ancho si es necesario */}
                     {/* El color del texto de la temperatura viene de 'gradientClass' */}
                    <p className={`text-4xl font-bold truncate`}>
                        {temperatureDisplay}
                    </p>
                </div>
            </div>
        </div>
    );

    // --- Renderizado Principal del Componente ---
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit" // Requiere <AnimatePresence> en el componente padre
            whileHover={isClickable ? { scale: 1.03, boxShadow: "0px 8px 16px rgba(0,0,0,0.1)" } : {}}
            layout // Anima cambios de layout
            // Aplica gradiente y texto base del helper aquí
            className={`rounded-xl shadow-lg p-4 sm:p-5 transition-all duration-300 ease-in-out overflow-hidden h-44 sm:h-48 ${gradientClass} ${isClickable ? 'hover:shadow-xl cursor-pointer' : 'opacity-90 cursor-default'}`}
            aria-label={`Tarjeta del clima para ${cityName}`}
        >
            {/* Renderiza como Link si es clickeable, si no como div */}
            {isClickable ? (
                <Link
                    to={linkTo}
                    aria-label={`Ver detalles del clima para ${cityName}`}
                    // Estilos de foco para accesibilidad
                    className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-current focus-visible:ring-indigo-500 rounded-lg"
                >
                    {cardContent}
                </Link>
            ) : (
                <div className="w-full h-full">{cardContent}</div>
            )}
        </motion.div>
    );
};

// --- Definición de PropTypes ---
CityCard.propTypes = {
    cityName: PropTypes.string.isRequired,
    temp: PropTypes.number,
    condition: PropTypes.string,
    iconCode: PropTypes.string,
    lat: PropTypes.number,
    lon: PropTypes.number,
    country: PropTypes.string,
};