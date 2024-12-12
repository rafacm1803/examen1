const mongoose = require('mongoose');

const FotoSchema = new mongoose.Schema({
    url: { type: String, required: true }
});

//Sofás: anfitrión (email), dirección (texto, hasta 80 caracteres), coordenadas (latitud, longitud), fotos (colección de URLs).
const SofaSchema = new mongoose.Schema({
    anfitrion: { type: String, required: true },
    direccion: { type: String, required: true, maxlength: 80 },
    coordenadas: {
        latitud: { type: Number, required: true },
        longitud: { type: Number, required: true }
    },
    fotos: [FotoSchema]
});

module.exports = mongoose.model('SofaSchema', SofaSchema);