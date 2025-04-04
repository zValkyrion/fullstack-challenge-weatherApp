// src/controllers/auth.controller.js
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; 

// --- Signup ---
exports.signup = async (req, res, next) => {
  const { username, password } = req.body;

  // Validación básica de entrada
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (password.length < 6) {
       return res.status(400).json({ message: 'Password must be at least 6 characters long' });
   }

  try {
    // 1. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' }); // 409 Conflict
    }

    // 2. Hashear la contraseña
    const saltRounds = 10; // Factor de coste para bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Crear y guardar el nuevo usuario
    const newUser = new User({
      username: username.toLowerCase(),
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    // 4. Generar un token JWT
    const payload = {
      userId: savedUser._id,
      username: savedUser.username,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }); // Token válido por 1 día

    // 5. Enviar respuesta (sin la contraseña)
    res.status(201).json({ // 201 Created
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
      },
      message: "User created successfully!"
    });

  } catch (error) {
    // o enviar una respuesta genérica por ahora
     console.error("Signup Error:", error);
     res.status(500).json({ message: 'Server error during signup' });
     next(error); // Usaremos esto cuando tengamos el error handler
  }
};

// --- Login ---
exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  // Validación básica
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // 1. Buscar al usuario por username (case-insensitive)
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Usuario no encontrado
    }

    // 2. Comparar la contraseña proporcionada con la hasheada en la DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Contraseña incorrecta
    }

    // 3. Generar JWT (si las credenciales son válidas)
    const payload = {
      userId: user._id,
      username: user.username,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    // 4. Enviar respuesta
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
       message: "Login successful!"
    });

  } catch (error) {
     console.error("Login Error:", error);
     res.status(500).json({ message: 'Server error during login' });
     next(error);
  }
};
