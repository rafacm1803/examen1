const mongoose = require('mongoose');

// Esquema para las visitas al mapa del usuario
const VisitSchema = new mongoose.Schema({
  viajeroEmail: { type: String, required: true }, // Email del usuario que ha viajado
  timestamp: { type: Date, default: Date.now },
  ciudad: { type: String, required: true, maxlength: 80 },
  tokenOAuth: { type: String, required: true } // Token de identificación OAuth del visitante
});

module.exports = mongoose.model('Visita', VisitSchema);