const axios = require('axios');
require('dotenv').config();
const NodeCache = require('node-cache');

// --- Configuración de Cache ---
// TTL (Time To Live) en segundos. 15 minutos = 900 segundos
const CACHE_TTL = process.env.CACHE_TTL_SECONDS || 900;
const weatherCache = new NodeCache({ stdTTL: CACHE_TTL }); // Crea la instancia de caché

// --- URL's y API Keys ---
const RESERVAMOS_API_URL = 'https://search.reservamos.mx/api/v2/places';
const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY; // Añadir a .env

const OPENWEATHER_ICON_URL_BASE = 'https://openweathermap.org/img/wn/';


// --- Obtener Coordenadas de Reservamos ---
const getCoordinates = async (cityName) => {
  try {
    console.log(`Workspaceing coordinates for: ${cityName}`); // Log para debugging
    const response = await axios.get(RESERVAMOS_API_URL, {
      params: { q: cityName }
    });

    // Filtrar por result_type: "city" y tomar el primer resultado
    const cityData = response.data.find(place => place.result_type === 'city');

    if (cityData && cityData.lat && cityData.long) {
       console.log(`Coordinates found for ${cityName}: Lat ${cityData.lat}, Lon ${cityData.long}`);
      return {
        lat: parseFloat(cityData.lat), // Asegurar que sean números
        lon: parseFloat(cityData.long)
      };
    } else {
      console.warn(`No city coordinates found for: ${cityName}`);
      return null; // O lanzar un error específico
    }
  } catch (error) {
    console.error(`Error fetching coordinates for ${cityName}:`, error.response ? error.response.data : error.message);
    // Lanzar el error para que el controlador lo maneje
    throw new Error(`Could not fetch coordinates for ${cityName}`);
  }
};

// --- Obtener Clima Actual de OpenWeather ---
const getCurrentWeather = async (lat, lon) => {
    if (!OPENWEATHER_API_KEY) {
        throw new Error("OpenWeather API key not configured");
    }
    if (lat === null || lon === null || typeof lat === 'undefined' || typeof lon === 'undefined') {
        console.warn("Invalid coordinates received for getCurrentWeather");
        return null; // O lanzar error si las coordenadas son inválidas
    }

    const cacheKey = `current_${lat}_${lon}`; // Clave única para esta ubicación
    const cachedData = weatherCache.get(cacheKey);

    if (cachedData) {
        console.log(`Cache HIT for current weather: ${cacheKey}`);
        return cachedData; // Devolver dato de caché si existe y es válido
      }
    
      console.log(`Cache MISS for current weather: ${cacheKey}. Fetching from API.`);    

  try {
    console.log(`Workspaceing current weather for: Lat ${lat}, Lon ${lon}`);
    const response = await axios.get(`${OPENWEATHER_API_URL}/weather`, {
      params: {
        lat: lat,
        lon: lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric' // Para temperatura en Celsius
      }
    });
    console.log(`Weather data received for Lat ${lat}, Lon ${lon}`);

    // Extraer solo la data necesaria
    const weatherData = response.data;
    weatherCache.set(cacheKey, weatherData);
    console.log(`Saved current weather to cache: ${cacheKey}`);

    return weatherData; 
  } catch (error) {
    console.error(`Error fetching current weather for Lat ${lat}, Lon ${lon}:`, error.response ? error.response.statusText : error.message);
    // No lanzar error aquí necesariamente, podría ser un fallo temporal de la API
    // El controlador decidirá si la falta de clima para una ciudad es crítica
    return null; // Indicar que no se pudo obtener el clima
  }
};

// --- Obtener Pronóstico de OpenWeather ---
const getForecast = async (lat, lon) => {
     if (!OPENWEATHER_API_KEY) {
        throw new Error("OpenWeather API key not configured");
    }
     if (lat === null || lon === null || typeof lat === 'undefined' || typeof lon === 'undefined') {
        console.warn("Invalid coordinates received for getForecast");
        return null;
    }

    const cacheKey = `forecast_${lat}_${lon}`; // Clave única
    const cachedData = weatherCache.get(cacheKey);

    if (cachedData) {
        console.log(`Cache HIT for forecast: ${cacheKey}`);
        return cachedData;
    }
 
    console.log(`Cache MISS for forecast: ${cacheKey}. Fetching from API.`);

  try {
    console.log(`Workspaceing forecast for: Lat ${lat}, Lon ${lon}`);
    // Usamos forecast, que da data cada 3 horas para 5 días en el plan gratuito
    const response = await axios.get(`${OPENWEATHER_API_URL}/forecast`, {
      params: {
        lat: lat,
        lon: lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });
     console.log(`Forecast data received for Lat ${lat}, Lon ${lon}`);

    // --- Procesamiento para obtener pronóstico diario (Simplificado) ---
    // Agrupa por día y calcula min/max temp y condición predominante
    const dailyForecasts = {};
    response.data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]; // Obtener solo la fecha YYYY-MM-DD
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: date,
          temps: [],
          conditions: {}, // Contar ocurrencias de condiciones
          icons:{} // Contar ocurrencias de iconos
        };
      }
      dailyForecasts[date].temps.push(item.main.temp);
      const condition = item.weather[0]?.main || 'N/A';
      const icon = item.weather[0]?.icon || 'N/A';
      dailyForecasts[date].conditions[condition] = (dailyForecasts[date].conditions[condition] || 0) + 1;
       dailyForecasts[date].icons[icon] = (dailyForecasts[date].icons[icon] || 0) + 1;
    });

    // Calcular min/max y condición/icono más frecuente por día
    const processedForecast = Object.values(dailyForecasts).map(day => {
      const minTemp = Math.min(...day.temps);
      const maxTemp = Math.max(...day.temps);
      // Encontrar la condición más frecuente
      let dominantCondition = 'N/A';
      let maxCountCondition = 0;
      for (const condition in day.conditions) {
        if (day.conditions[condition] > maxCountCondition) {
          dominantCondition = condition;
          maxCountCondition = day.conditions[condition];
        }
      }
       // Encontrar el icono más frecuente (útil para representar el día)
      let dominantIcon = 'N/A';
      let maxCountIcon = 0;
      for (const icon in day.icons) {
        if (day.icons[icon] > maxCountIcon) {
          dominantIcon = icon;
          maxCountIcon = day.icons[icon];
        }
      }

      return {
        date: day.date,
        temp_min: minTemp,
        temp_max: maxTemp,
        condition: dominantCondition, // Condición principal del día
        icon: dominantIcon // Icono representativo del día
      };
    }).slice(0, 7); // Limitar a un máximo de 7 días (aunque /forecast da 5)

    // Guardar en caché
    weatherCache.set(cacheKey, processedForecast);
    console.log(`Saved forecast to cache: ${cacheKey}`);
    return processedForecast;
  } catch (error) {
    console.error(`Error fetching forecast for Lat ${lat}, Lon ${lon}:`, error.response ? error.response.statusText : error.message);
    return null; // Indicar que no se pudo obtener el pronóstico
  }
};

// Combinar ubicación y clima actual
const getLocationAndCurrentWeather = async (lat, lon) => {
    try {
      // 1. Llama DIRECTAMENTE a la función getCurrentWeather (ya está en este archivo)
      const weatherData = await getCurrentWeather(lat, lon);
  
      // 2. Verifica si se obtuvieron datos
      if (!weatherData) {
        throw new Error('Could not retrieve current weather data.');
      }
  
      // 3. Extrae y formatea los datos... (resto de la función igual)
      const locationInfo = {
        name: weatherData.name || 'Ubicación desconocida',
        country: weatherData.sys?.country || 'N/A',
      };
  
      const currentInfo = {
        temp_c: weatherData.main?.temp,
        feelslike_c: weatherData.main?.feels_like,
        humidity: weatherData.main?.humidity,
        condition: {
          text: weatherData.weather?.[0]?.main || 'N/A',
          description: weatherData.weather?.[0]?.description || 'N/A',
          icon: weatherData.weather?.[0]?.icon ? `${OPENWEATHER_ICON_URL_BASE}${weatherData.weather[0].icon}@2x.png` : null,
          code: weatherData.weather?.[0]?.id
        },
        wind_mps: weatherData.wind?.speed,
      };
  
      // 4. Combina y devuelve
      return {
        location: locationInfo,
        current: currentInfo
      };
  
    } catch (error) {
      console.error(`Error in getLocationAndCurrentWeather for (${lat}, ${lon}):`, error.message);
      throw error; // Relanza para que la ruta lo maneje
    }
  };

module.exports = {
  getCoordinates,
  getCurrentWeather,
  getForecast,
  getLocationAndCurrentWeather
};