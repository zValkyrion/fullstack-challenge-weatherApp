const express = require('express');
const cors = require('cors'); 
require('dotenv').config(); 
const connectDB = require('./config/database');

// --- Conectar a la Base de Datos ---
connectDB();

// --- Importar Rutas y Middlewares ---
const authRoutes = require('./routes/auth.routes');
const weatherRoutes = require('./routes/weather.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

// --- Crear instancia de Express ---
const app = express();

// Define las opciones de CORS explícitamente
const corsOptions = {
  // Permite peticiones SOLO desde tu frontend (cambia el puerto si usas otro)
  origin: 'http://localhost:5173',
  // Métodos HTTP permitidos
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // Cabeceras permitidas - ¡CLAVE INCLUIR 'Authorization'!
  allowedHeaders: ['Content-Type', 'Authorization'],
  // credentials: true
};

// Usa el middleware cors CON las opciones configuradas
// REEMPLAZA tu app.use(cors()); original con esta línea:
app.use(cors(corsOptions));
// --- Fin Configuración de CORS ---


// --- Middlewares Esenciales (después de CORS) ---
app.use(express.json()); // Permite al servidor entender JSON en las requests
app.use(express.urlencoded({ extended: true })); // Permite entender datos de formularios


// --- Rutas ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is running' });
});

// Monta las rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);


// --- Manejo de Rutas No Encontradas (404) ---
app.use(notFound);


// --- Manejador de Errores Global ---
// Debe ser el ÚLTIMO middleware que se registra
app.use(errorHandler);


// --- Puerto y Arranque del Servidor ---
const PORT = process.env.PORT || 5001; // Usa el puerto de .env o 5001 por defecto

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

module.exports = app; // Export for potential testing
