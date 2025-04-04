const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  let token;

  // 1. Buscar el token en el header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraer el token (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificar el token
      const decoded = jwt.verify(token, JWT_SECRET);

      // 3. Obtener usuario desde la DB (sin la contraseña) y adjuntarlo a la request
      // Esto asegura que el usuario todavía existe
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
           // Si el usuario asociado al token ya no existe
           return res.status(401).json({ message: 'Not authorized, user not found' });
       }

      next(); // Continuar a la siguiente ruta/middleware

    } catch (error) {
      console.error('Token verification failed:', error.message);
      // Errores comunes: TokenExpiredError, JsonWebTokenError
      if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Not authorized, token expired' });
       }
       return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Si no hay token en el header
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };