const mongoose = require('mongoose');

//Reservas: anfitrión (email), huésped (email), desde (fecha de inicio de la reserva), días (duración de la reserva).

const ReservaSchema = new mongoose.Schema({
    anfitrion: { type: String, required: true },
    huesped: { type: String, required: true },
    desde: { type: Date, required: true },
    dias: { type: Number, required: true }
});

module.exports = mongoose.model('ReservaSchema', ReservaSchema);