const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true, // Elimina espacios al inicio/final
    lowercase: true // Guarda en minúsculas para evitar duplicados por case
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'] // Ejemplo de validación
  },
}, {
  // Añade timestamps (createdAt, updatedAt) automáticamente
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;