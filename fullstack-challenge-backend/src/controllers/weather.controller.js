
const weatherService = require('../services/weather.service');

// --- Obtener Clima Actual para Múltiples Ciudades ---
exports.getWeatherForCities = async (req, res, next) => {
  const cityNamesQuery = req.query.names; // Ej: "Monterrey,Guadalajara,Mexico City"

  if (!cityNamesQuery) {
    // Devolvemos error directamente, usando return para detener la ejecución
    return res.status(400).json({ message: 'Query parameter "names" is required' });
  }

  const cityNames = cityNamesQuery.split(',').map(name => name.trim()); // Array de nombres

  try {
    const weatherResults = [];

    // Usamos Promise.all para ejecutar las búsquedas en paralelo (más eficiente)
    await Promise.all(cityNames.map(async (name) => {
      try {
        const coords = await weatherService.getCoordinates(name);
        let weather = null;
        if (coords) {
          weather = await weatherService.getCurrentWeather(coords.lat, coords.lon);
        }
        // Añadir al resultado incluso si el clima no se encontró
        weatherResults.push({
            cityName: name,
            coordinates: coords, // Puede ser null
            currentWeather: weather // Puede ser null
        });
      } catch (error) {
         // Si falla obtener coordenadas para UNA ciudad, lo registramos pero continuamos
         console.error(`Failed processing city ${name}: ${error.message}`);
         weatherResults.push({
             cityName: name,
             error: `Failed to process: ${error.message}` // Indicar el error
         });
      }
    }));

    // Ordenar los resultados para que coincidan con el orden de entrada (opcional pero bueno)
    const orderedResults = cityNames.map(name =>
        weatherResults.find(r => r.cityName.toLowerCase() === name.toLowerCase()) || { cityName: name, error: 'Processing failed unexpectedly' }
    );

    res.status(200).json(orderedResults);

  } catch (error) {
     // Error general (poco probable con el catch individual, pero por si acaso)
     console.error("Error in getWeatherForCities controller:", error);
     // Pasamos el error al manejador global
     next(error);
  }
};

// --- Obtener Pronóstico para una Ciudad por Coordenadas ---
exports.getWeatherForecast = async (req, res, next) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
     // Devolvemos error directamente
    return res.status(400).json({ message: 'Query parameters "lat" and "lon" are required' });
  }

   // Validar que lat y lon sean números
   const latitude = parseFloat(lat);
   const longitude = parseFloat(lon);
    if (isNaN(latitude) || isNaN(longitude)) {
        // Devolvemos error directamente
        return res.status(400).json({ message: 'Invalid latitude or longitude values' });
      }

  try {
    // Llama a la función del servicio para obtener el pronóstico
    const forecast = await weatherService.getForecast(latitude, longitude);

    if (forecast && forecast.length > 0) { // Verifica que forecast no sea null y tenga datos
      res.status(200).json(forecast);
    } else {
      // Si el servicio devuelve null o un array vacío
      // Usamos 404 porque no se encontraron datos para esas coordenadas
      res.status(404).json({ message: `Could not retrieve forecast for coordinates ${latitude}, ${longitude}` });
    }
  } catch (error) {
     console.error("Error in getWeatherForecast controller:", error);
     // Pasamos el error al manejador global
     next(error);
     // Opcional: Enviar respuesta directa
     // res.status(500).json({ message: "Server error fetching weather forecast" });
  }
};

// --- Obtener Detalles (Ubicación + Clima Actual) por Coordenadas ---
exports.getDetailsByCoords = async (req, res, next) => {
  const { lat, lon } = req.query; // Obtiene lat y lon de los query parameters

  // Validación básica de coordenadas
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    // Si son inválidos, no continuamos. Enviamos 400 Bad Request.
    return res.status(400).json({ message: 'Invalid or missing coordinates (lat, lon) in query parameters.' });
    // res.status(400);
    // return next(new Error('Invalid or missing coordinates...'));
  }

  try {
    const details = await weatherService.getLocationAndCurrentWeather(latitude, longitude);

    // Si el servicio no pudo obtener datos (ej: error interno al llamar a OpenWeather)
    if (!details) {
       // Usamos 404 Not Found porque no se encontraron datos para esas coords.
       return res.status(404).json({ message: 'Could not retrieve details for the specified coordinates.' });
    }

    // ¡Éxito! Envía la respuesta JSON combinada al frontend
    res.status(200).json(details);

  } catch (error) {
    // Si ocurre cualquier otro error (ej: error inesperado en el servicio)
    console.error(`[Controller Error] getDetailsByCoords (${latitude}, ${longitude}):`, error);
    // Pasa el error al manejador de errores global definido en server.js
    next(error);
  }
};
