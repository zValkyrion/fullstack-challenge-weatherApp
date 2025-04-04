// src/pages/CityDetailPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

// Importar funciones del servicio API
import { getCityDetailsByCoords, getForecast } from "../services/api";

// Importar Componentes UI
import { Alert } from "../components/Alert"; 
import { ForecastItem } from "../components/ForecastItem"; 
import { ForecastSkeleton } from "../components/ForecastSkeleton"; 
import { CityDetailSkeleton } from "../components/CityDetailSkeleton"; 

// Importar Iconos
import {
  FiArrowLeft,
  FiMapPin,
  FiThermometer,
  FiDroplet,
  FiWind,
  FiSun,
  FiCloudRain,
  FiCloud,
  FiHelpCircle,
} from "react-icons/fi"; 


const WeatherIcon = ({ conditionText, className = "w-6 h-6", ...props }) => {
  const text = conditionText?.toLowerCase() || "";
  if (
    text.includes("rain") ||
    text.includes("drizzle") ||
    text.includes("showers")
  )
    return <FiCloudRain className={className} {...props} />;
  if (text.includes("sun") || text.includes("clear"))
    return <FiSun className={className} {...props} />;
  if (text.includes("cloud") || text.includes("overcast"))
    return <FiCloud className={className} {...props} />; 
  if (text.includes("snow"))
    return <FiCloudRain className={className} {...props} />;
  if (text.includes("mist") || text.includes("fog") || text.includes("haze"))
    return <FiCloud className={className} {...props} />; 
  return <FiHelpCircle className={className} {...props} />; 
};

const getGradientClasses = (temp) => {
  if (temp === null || typeof temp === 'undefined') {
    return 'from-gray-100 via-gray-200 to-gray-300'; // Neutral suave
  }

  if (temp <= -5) {
    // Muy frío
    return 'from-blue-400 via-blue-200 to-blue-100';
  } else if (temp <= 5) {
    // Frío
    return 'from-sky-300 via-sky-200 to-sky-100';
  } else if (temp <= 12) {
    // Fresco
    return 'from-cyan-300 via-cyan-200 to-cyan-100';
  } else if (temp <= 20) {
    // Templado (azul claro)
    return 'from-blue-300 via-sky-200 to-blue-100';
  } else if (temp <= 28) {
    // Cálido
    return 'from-orange-300 via-amber-200 to-amber-100';
  } else {
    // Muy Caliente
    return 'from-rose-400 via-rose-200 to-rose-100';
  }
};


export const CityDetailPage = () => {
  // 1. Obtener lat y lon de los parámetros de la URL
  const { lat, lon } = useParams();

  // 2. Convertir a número y validar
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const areCoordsValid = !isNaN(latitude) && !isNaN(longitude);

  // 3. Query para obtener detalles de la ciudad y clima actual
  const {
    data: cityData,
    isLoading: isLoadingDetails, // Renombrado para evitar colisión
    isError: isErrorDetails, // Renombrado
    error: errorDetails, // Renombrado
    isSuccess: isSuccessDetails,
  } = useQuery({
    queryKey: ["cityDetails", latitude, longitude], // Clave única
    queryFn: () => getCityDetailsByCoords(latitude, longitude),
    enabled: areCoordsValid, // Solo ejecuta si las coordenadas son válidas
    staleTime: 10 * 60 * 1000, // Cache por 10 minutos
  });

  // 4. Query para obtener el pronóstico extendido
  const {
    data: forecastData,
    isLoading: isLoadingForecast, // Renombrado
    isError: isErrorForecast, // Renombrado
    error: errorForecast, // Renombrado
    isSuccess: isSuccessForecast,
  } = useQuery({
    queryKey: ["forecast", latitude, longitude], // Clave única diferente
    queryFn: () => getForecast(latitude, longitude),
    enabled: areCoordsValid, // Solo ejecuta si las coordenadas son válidas
    staleTime: 30 * 60 * 1000, // Cache por 30 minutos (pronósticos cambian menos freq.)
  });

  // 5. Formatear la fecha actual
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 6. Animaciones para el pronóstico (opcional, puedes ajustar)
  const forecastContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }, // Animación escalonada para los items
    },
  };
  const forecastItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // --- Renderizado del componente ---
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      // Contenedor principal con ancho máximo y padding
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Botón para Volver */}
      <Link
        to="/"
        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-6 group transition-colors"
      >
        <FiArrowLeft className="mr-1 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Volver a destinos
      </Link>

      {/* --- Manejo de Estados Globales (Coordenadas Inválidas) --- */}
      {!areCoordsValid && (
        <Alert
          type="warning"
          title="Coordenadas Inválidas"
          message="La URL no contiene coordenadas geográficas válidas."
        />
      )}

      {/* === SECCIÓN DE DETALLES DEL CLIMA ACTUAL === */}
      {areCoordsValid && (
        <div className="mb-10">
          {" "}
          {/* Añade margen inferior para separar de la previsión */}
          {/* Estado de Carga Detalles */}
          {isLoadingDetails && <CityDetailSkeleton />}
          {/* Estado de Error Detalles */}
          {isErrorDetails && (
            <Alert
              type="error"
              title="Error al cargar detalles del clima"
              message={
                errorDetails?.response?.data?.message ||
                errorDetails?.message ||
                "No se pudieron obtener los detalles actuales."
              }
            />
          )}
          {/* Estado Exitoso Detalles */}
          {isSuccessDetails && cityData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Encabezado: Nombre y Ubicación */}
              <div className="mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 flex items-center">
                  <FiMapPin className="mr-3 h-7 w-7 text-gray-400 flex-shrink-0" />{" "}
                  {/* Icono de ubicación */}
                  {cityData.location?.name || "Ciudad Desconocida"}
                </h1>
                <p className="text-md text-gray-500 pl-10">
                  {" "}
                  {/* Alineado con el texto del título */}
                  {`${
                    cityData.location?.region
                      ? cityData.location.region + ", "
                      : ""
                  }${cityData.location?.country || "Ubicación desconocida"}`}
                </p>
              </div>

              {/* Tarjeta Principal: Clima Actual */}
              {(() => {
                                // Calcula las clases del gradiente ANTES de renderizar el div
                                const currentTemp = cityData.current?.temp_c;
                                const gradientClasses = getGradientClasses(currentTemp);

                                return (
                                    // Aplica las clases dinámicas aquí
                                    <div className={`bg-gradient-to-br ${gradientClasses} text-white p-6 rounded-lg shadow-xl transition-all duration-500 ease-in-out`}>
                                        {/* Contenido de la tarjeta (sin cambios aquí) */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
                                            <div>
                                                <h2 className="text-xl font-semibold">{cityData.location?.name || ''}</h2>
                                                <p className="text-sm opacity-90">{currentDate}</p>
                                            </div>
                                            <div className="text-left sm:text-right w-full sm:w-auto">
                                                <div className="flex items-center justify-start sm:justify-end">
                                                    {cityData.current?.condition?.icon ? (
                                                        <img src={cityData.current.condition.icon.replace(/^\/\//, 'https://')}
                                                             alt={cityData.current.condition.text || 'clima'}
                                                             className="w-14 h-14 -mt-1 mr-1 flex-shrink-0" />
                                                    ) : (
                                                        <WeatherIcon conditionText={cityData.current?.condition?.text} className="w-14 h-14 -mt-1 mr-1 opacity-90 flex-shrink-0" />
                                                    )}
                                                    <span className="text-5xl font-bold">{Math.round(cityData.current?.temp_c ?? 0)}°</span><span className="text-3xl font-light relative -top-2">C</span>
                                                </div>
                                                <p className="text-sm opacity-90 mt-1 capitalize">{cityData.current?.condition?.text || '-'}</p>
                                            </div>
                                        </div>

                                        {/* Detalles Adicionales */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center mt-6 pt-4 border-t border-white/20">
                                            {/* Sensación Térmica */}
                                            <div className="bg-white/10 hover:bg-white/20 p-3 rounded transition-colors cursor-default">
                                                <FiThermometer className="mx-auto mb-1 h-5 w-5 opacity-80" />
                                                <p className="text-xs opacity-80">Sensación</p>
                                                <p className="font-medium">{Math.round(cityData.current?.feelslike_c ?? 0)}°C</p>
                                            </div>
                                            {/* Humedad */}
                                            <div className="bg-white/10 hover:bg-white/20 p-3 rounded transition-colors cursor-default">
                                                <FiDroplet className="mx-auto mb-1 h-5 w-5 opacity-80" />
                                                <p className="text-xs opacity-80">Humedad</p>
                                                <p className="font-medium">{cityData.current?.humidity ?? 0}%</p>
                                            </div>
                                            {/* Viento */}
                                            <div className="bg-white/10 hover:bg-white/20 p-3 rounded transition-colors cursor-default">
                                                <FiWind className="mx-auto mb-1 h-5 w-5 opacity-80" />
                                                <p className="text-xs opacity-80">Viento</p>
                                                <p className="font-medium">{cityData.current?.wind_kph ?? 0} km/h</p>
                                            </div>
                                             {/* Condición (Texto e Icono pequeño) */}
                                            <div className="bg-white/10 hover:bg-white/20 p-3 rounded transition-colors cursor-default flex flex-col items-center justify-center">
                                                <WeatherIcon conditionText={cityData.current?.condition?.text} className="mb-1 h-5 w-5 opacity-80" />
                                                <p className="text-xs opacity-80">Condición</p>
                                                <p className="font-medium text-xs capitalize text-center">{cityData.current?.condition?.text || '-'}</p>
                                            </div>
                                        </div>
                                    </div> // Cierre de la tarjeta con gradiente dinámico
                                );
                            })()} {/* Fin de la IIFE */}
            </motion.div>
          )}
        </div>
      )}

      {/* === SECCIÓN DE PRONÓSTICO EXTENDIDO === */}
      {areCoordsValid && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Pronóstico Extendido
          </h2>

          {/* Estado de Carga Pronóstico */}
          {isLoadingForecast && (
            <div className="space-y-3">
              {/* Muestra algunos skeletons mientras carga */}
              {[...Array(5)].map((_, index) => (
                <ForecastSkeleton key={`forecast-skel-${index}`} />
              ))}
            </div>
          )}

          {/* Estado de Error Pronóstico */}
          {isErrorForecast && (
            <Alert
              type="error"
              title="Error al cargar el pronóstico"
              message={
                errorForecast?.message ||
                "No se pudieron obtener los datos del pronóstico."
              }
            />
          )}

          {/* Estado Exitoso Pronóstico */}
          {isSuccessForecast && forecastData && (
            <motion.div
              className="space-y-3 bg-white/50 p-4 rounded-lg shadow-md backdrop-blur-sm"
              variants={forecastContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {forecastData.length > 0 ? (
                forecastData.map((dayForecast) => {
                  // Asumimos que la estructura de dayForecast es algo como:
                  // { date: '...', temp_min: N, temp_max: N, condition: { text: '...', icon: '...' }, wind_kph: N, ... }
                  // Ajusta las claves 'condition.text' y 'wind_kph' si tu API las devuelve diferente.
                  const conditionText = dayForecast.condition?.text;
                  const windSpeed = dayForecast.wind_kph; // o wind_mps, etc. según tu API

                  return (
                    <motion.div
                      key={dayForecast.date}
                      variants={forecastItemVariants}
                    >
                      <ForecastItem
                        {...dayForecast} // Pasa el resto de props (date, temp_min, temp_max, etc.)
                        conditionText={conditionText} // Pasa la descripción de la condición
                        windSpeed={windSpeed} // Pasa la velocidad del viento (ForecastItem)
                        // Pasa el componente de icono o la URL si existe
                        iconComponent={
                          <WeatherIcon
                            conditionText={conditionText}
                            className="w-10 h-10 text-gray-700"
                          />
                        }
                      />
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No hay datos de pronóstico disponibles.
                </p>
              )}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};
