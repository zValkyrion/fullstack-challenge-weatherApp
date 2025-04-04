// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getCitiesWeather } from '../services/api'; // Tu función del servicio API
import { useAuth } from '../contexts/AuthContext'; // Necesario para el token
import { CityCard } from '../components/CityCard';
import { CityCardSkeleton } from '../components/CityCardSkeleton';
import { Alert } from '../components/Alert';
import { Input } from '../components/Input'; // Importa Input
import { Button } from '../components/Button'; // Importa Button
import { FiSearch, FiXCircle } from 'react-icons/fi'; // Iconos

// --- Lista Expandida de Ciudades Populares ---
const popularCities = [
    'Monterrey',
    'Ciudad de México',
    'Guadalajara',
    'Cancun',
    'Tijuana',
    'Queretaro',
    'Puebla',
    'Merida',
    'Buenos Aires' 
];

export const HomePage = () => {
    const { token } = useAuth(); // Token para llamadas API

    // --- Estados para la búsqueda ---
    const [searchQuery, setSearchQuery] = useState(''); // Valor del input de búsqueda
    const [searchedCityData, setSearchedCityData] = useState(null); // Resultado de la búsqueda
    const [isSearching, setIsSearching] = useState(false); // Indicador de carga para búsqueda
    const [searchError, setSearchError] = useState(null); // Error de la búsqueda

    // --- Query para ciudades populares (usa la lista expandida) ---
    const {
        data: popularCitiesWeather, // Datos de las ciudades populares
        isLoading: isLoadingPopular, // Estado de carga para populares
        isError: isErrorPopular, // Estado de error para populares
        error: errorPopular,     // Objeto de error para populares
        refetch: refetchPopular, // Función para re-intentar carga de populares
    } = useQuery({
        // La query key ahora incluye 'popular' para diferenciarla si hubiera otras listas
        queryKey: ['weather', 'cities', 'popular', popularCities.join(',')],
        queryFn: () => getCitiesWeather(popularCities), // Llama a la API con la lista expandida
        // Habilita la query solo si hay token y si no hay un resultado de búsqueda activo
        enabled: !!token && !searchedCityData,
        // Opcional: Mantener datos previos mientras recarga en segundo plano
        // keepPreviousData: true,
    });

    // --- Función para manejar la búsqueda ---
    const handleSearch = async (e) => {
        if (e) e.preventDefault(); // Prevenir recarga si viene de un <form>
        if (!searchQuery.trim()) return; // No buscar si el input está vacío

        setIsSearching(true);
        setSearchError(null);
        setSearchedCityData(null); // Limpia resultados previos

        try {
            // Llama a la API con un array que contiene solo la ciudad buscada
            const results = await getCitiesWeather([searchQuery]);

            if (results && results.length > 0) {
                 const cityResult = results[0];
                 // Verifica si el backend indicó un error para esa ciudad o si faltan datos clave
                 if (cityResult.error || !cityResult.coordinates || !cityResult.currentWeather) {
                     setSearchError(`No se encontró información válida para "${searchQuery}". Intenta con otro nombre o verifica la escritura.`);
                     setSearchedCityData(null);
                 } else {
                    setSearchedCityData(cityResult); // Guarda el resultado válido
                 }
            } else {
                // Si la API no devuelve nada en el array
                setSearchError(`No se encontró información para "${searchQuery}".`);
                setSearchedCityData(null);
            }
        } catch (err) {
            // Error en la llamada API misma (ej. problema de red)
            console.error("Search API error:", err);
            setSearchError(err.message || 'Ocurrió un error al buscar la ciudad.');
            setSearchedCityData(null);
        } finally {
            setIsSearching(false); // Termina el estado de carga de la búsqueda
        }
    };

    // --- Función para limpiar la búsqueda y volver a populares ---
    const clearSearch = () => {
        setSearchQuery('');
        setSearchedCityData(null);
        setSearchError(null);
        // Si los datos populares no se cargaron antes (porque 'enabled' era false),
        // podemos intentar cargarlos ahora.
         if (!popularCitiesWeather && !!token) {
             refetchPopular();
         }
    };

    // --- Variantes para animación con Framer Motion ---
     const containerVariants = {
         hidden: { opacity: 0 },
         visible: {
             opacity: 1,
             transition: { staggerChildren: 0.08 }, // Ajusta el retraso entre tarjetas
         },
     };

    // --- Renderizado del Componente ---
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8" // Añade más espacio vertical
        >

            {!searchedCityData && (
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Destinos Populares
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        Explora las condiciones climáticas para estos destinos populares.
                    </p>
                </div>
            )}
            
            {/* --- Barra de Búsqueda --- */}
            <div className="mb-8 pt-4"> {/* Padding top para separar de la navbar */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto  rounded-lg shadow">
                    <Input
                        type="search"
                        placeholder="Busca el clima de cualquier ciudad..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow text-base" // Input un poco más grande
                        disabled={isSearching}
                        aria-label="Buscar ciudad"
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSearching || !searchQuery.trim()}
                        isLoading={isSearching}
                        iconLeft={<FiSearch />}
                        className="w-full sm:w-auto" // Ancho completo en móvil
                    >
                        Buscar
                    </Button>
                     {/* Botón para limpiar, aparece si hay búsqueda o resultado */}
                     {(searchedCityData || searchQuery) && !isSearching && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={clearSearch}
                            iconLeft={<FiXCircle />}
                            title="Limpiar búsqueda y ver populares"
                            className="w-full sm:w-auto" // Ancho completo en móvil
                        >
                            Limpiar
                        </Button>
                     )}
                </form>
                {/* Muestra error de búsqueda si existe y no está cargando */}
                {searchError && !isSearching && (
                     <div className="max-w-2xl mx-auto mt-3">
                        <Alert type="error" message={searchError} onDismiss={() => setSearchError(null)} />
                     </div>
                )}
            </div>

            {/* --- Contenido Principal (Resultado de Búsqueda o Lista Popular) --- */}
            <div className="min-h-[300px]"> {/* Altura mínima para evitar saltos durante carga */}
                {/* Muestra resultado de búsqueda si existe */}
                {searchedCityData && !isSearching && (
                     <motion.div
                        layout // Anima suavemente el cambio de tamaño/posición
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-sm mx-auto" // Centra la tarjeta única
                     >
                         <CityCard
                             key={searchedCityData.cityName}
                             cityName={searchedCityData.cityName}
                             temp={searchedCityData.currentWeather.main?.temp}
                             condition={searchedCityData.currentWeather.weather[0]?.description}
                             iconCode={searchedCityData.currentWeather.weather[0]?.icon}
                             lat={searchedCityData.coordinates?.lat}
                             lon={searchedCityData.coordinates?.lon}
                         />
                     </motion.div>
                )}

                {/* Muestra populares si NO hay resultado de búsqueda */}
                {!searchedCityData && (
                    <>
                         {/* Estado de Carga para Populares */}
                         {isLoadingPopular && (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                             >
                                {/* Muestra skeletons según el número de ciudades en la lista */}
                                {popularCities.map((city, index) => <CityCardSkeleton key={`skeleton-${index}`} />)}
                            </motion.div>
                         )}

                         {/* Estado de Error para Populares */}
                         {isErrorPopular && !isLoadingPopular && (
                            <div className="max-w-2xl mx-auto">
                                <Alert type="error" title="Error al cargar destinos populares" message={errorPopular?.message || 'No se pudieron obtener los datos.'} />
                            </div>
                         )}

                        {/* Estado Exitoso para Populares */}
                        {!isLoadingPopular && !isErrorPopular && popularCitiesWeather && (
                             <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                             >
                                 <AnimatePresence>
                                     {popularCitiesWeather
                                         // Filtro robusto para asegurar que tenemos datos válidos
                                         .filter(city => city && !city.error && city.currentWeather?.main && city.currentWeather?.weather?.length > 0)
                                         .map((city) => (
                                             <CityCard
                                                 key={city.cityName} // Usa cityName como key único
                                                 cityName={city.cityName}
                                                 temp={city.currentWeather.main.temp}
                                                 condition={city.currentWeather.weather[0].description}
                                                 iconCode={city.currentWeather.weather[0].icon}
                                                 lat={city.coordinates?.lat}
                                                 lon={city.coordinates?.lon}
                                             />
                                         ))}
                                 </AnimatePresence>
                                 {/* Opcional: Mostrar alertas para ciudades populares que fallaron */}
                                 {popularCitiesWeather
                                    .filter(city => city && (city.error || !city.currentWeather))
                                    .map((city) => (
                                      <motion.div key={`${city.cityName}-error`} variants={containerVariants}>
                                        <Alert type="warning" title={`Error: ${city.cityName}`} message={city.error || 'No se pudo obtener el clima.'} />
                                      </motion.div>
                                    ))
                                }
                             </motion.div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
};