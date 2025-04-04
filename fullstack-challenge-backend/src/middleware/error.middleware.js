// Middleware para manejar errores no capturados en las rutas/controladores
// Debe tener 4 argumentos: err, req, res, next
const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err.stack || err); // Log detallado del error en el servidor
  
    // Determinar el código de estado. Si el error tiene un statusCode, usarlo, si no, 500.
    const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  
    res.status(statusCode).json({
      message: err.message || 'Internal Server Error',
      // Opcional: Solo mostrar el stack trace en desarrollo
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  };
  
  // Middleware para rutas no encontradas (404)
  const notFound = (req, res, next) => {
     res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
   };
  
  
  module.exports = { errorHandler, notFound };