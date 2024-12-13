const mongoose = require('mongoose');

// Esquema para los marcadores del mapa del usuario
const MarkerSchema = new mongoose.Schema({
  pais: { type: String, required: true },
  ciudad: { type: String, required: true },
  latitud: { type: Number, required: true },
  longitud: { type: Number, required: true },
  imagenUrl: { type: String, required: true } // URL de la imagen almacenada en Cloudinary o similar
});

// Esquema para las visitas al mapa del usuario
const VisitSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  emailVisitante: { type: String, required: true },
  tokenOAuth: { type: String, required: true }
});

// Esquema para el usuario
const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  marcadores: [MarkerSchema], // Lista de marcadores del mapa del usuario
  visitas: [VisitSchema] // Lista de visitas al mapa del usuario
});

module.exports = mongoose.model('Usuario', UsuarioSchema);