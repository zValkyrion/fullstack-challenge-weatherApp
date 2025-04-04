// src/routes/weather.routes.js
const express = require('express');
const router = express.Router();
// Importa el controlador
const weatherController = require('../controllers/weather.controller');
// Importa el middleware de protección
const { protect } = require('../middleware/auth.middleware');

// GET /api/weather/cities?names=city1,city2,...
router.get('/cities', protect, weatherController.getWeatherForCities);

// GET /api/weather/forecast?lat=...&lon=...
router.get('/forecast', protect, weatherController.getWeatherForecast);

// Usará el mismo middleware 'protect' y un nuevo método del controlador
router.get('/details-by-coords', protect, weatherController.getDetailsByCoords);
// -----------------------------------------

module.exports = router; // Exporta el router con la nueva ruta añadida
