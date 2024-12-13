const mongoose = require('mongoose');

// Esquema para las visitas al mapa del usuario
const VisitSchema = new mongoose.Schema({
  usuarioEmail: { type: String, required: true }, // Email del usuario visitado
  timestamp: { type: Date, default: Date.now }, // Fecha y hora de la visita
  emailVisitante: { type: String, required: true }, // Email del visitante
  tokenOAuth: { type: String, required: true } // Token de identificación OAuth del visitante
});

module.exports = mongoose.model('Visita', VisitSchema);