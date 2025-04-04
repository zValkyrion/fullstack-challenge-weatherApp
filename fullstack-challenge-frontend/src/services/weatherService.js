import api from './api'; // Importa la instancia configurada de Axios

// Obtiene el clima actual de las ciudades populares (definidas en el backend)
export const getPopularCitiesWeather = async () => {
  try {
    const response = await api.get('/weather/popular'); // Llama al endpoint del backend
    return response.data; // Devuelve el array de datos de clima de ciudades
  } catch (error) {
    console.error("Error fetching popular cities weather:", error.response?.data?.message || error.message);
    throw error.response?.data || new Error('Could not fetch popular cities');
  }
};

// Obtiene el pronóstico para una ciudad específica
export const getCityForecast = async (cityName) => {
   try {
     // Asegúrate que el nombre de la ciudad esté codificado para URL
     const encodedCityName = encodeURIComponent(cityName);
     const response = await api.get(`/weather/forecast/${encodedCityName}`);
     return response.data;
   } catch (error) {
     console.error(`Error fetching forecast for ${cityName}:`, error.response?.data?.message || error.message);
     throw error.response?.data || new Error(`Could not fetch forecast for ${cityName}`);
   }
};