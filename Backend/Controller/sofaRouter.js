const express = require("express");
const sofaRouter = express.Router();
const Sofa = require("../Model/sofa");
const Log = require("../Model/log");
const axios = require("axios");

// Crear sofá
sofaRouter.post("/", async (req, res) => {
    const token = req.headers.authorization;

    // Validar token
    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    const log = await Log.find({ token: token });
    if (!log) {
        return res.status(401).json({ message: "Token inválido" });
    }

    const { anfitrion, direccion, latitud, longitud, fotos } = req.body;

    // Validar campos requeridos
    if (!anfitrion || !direccion || !latitud || !longitud) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    if (!fotos || !Array.isArray(fotos) || !fotos.every((url) => typeof url === "string")) {
        return res.status(400).json({ message: "El campo 'fotos' debe ser un array de URLs válidas" });
    }

    try {
        // Subir las imágenes al controlador de imágenes
        const uploadedPhotos = await Promise.all(
            fotos.map(async (url) => {
                try {
                    const response = await axios.post(`https://despliegue-iw-b.vercel.app/imagenes`, { imageUrl: url });
                    // Devolver la URL subida como un objeto con la propiedad 'url'
                    return { url: response.data.url }; 
                } catch (error) {
                    console.error(`Error al subir la imagen desde la URL ${url}:`, error.message);
                    throw new Error(`No se pudo subir la imagen: ${url}`);
                }
            })
        );
        

        // Crear y guardar el nuevo sofá
        const newSofa = new Sofa({
            anfitrion,
            direccion,
            coordenadas: {
                latitud,
                longitud,
            },
            fotos: uploadedPhotos, // URLs subidas
        });

        const savedSofa = await newSofa.save();
        res.status(201).json(savedSofa);
    } catch (error) {
        console.error("Error al procesar la solicitud:", error.message);
        res.status(500).json({ message: "Error al crear el sofá", error: error.message });
    }
});

//Mostrar todos los sofas ofertados y las reservas sobre cada uno de ellos
/*
const ReservaSchema = new mongoose.Schema({
    anfitrion: { type: String, required: true },
    huesped: { type: String, required: true },
    desde: { type: Date, required: true },
    dias: { type: Number, required: true }
});
*/
sofaRouter.get("/", async (req, res) => {
    const token = req.headers.authorization;

    // Validar token
    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    const log = await Log.find({ token: token });
    if (!log) {
        return res.status(401).json({ message: "Token inválido" });
    }

    try {
        const sofas = await Sofa.find();
        res.status(200).json(sofas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los sofas", error });
    }
});

//filtrar alojamientos a partir de (parte de) su dirección
sofaRouter.get("/buscar", async (req, res) => {
    const token = req.headers.authorization;

    // Validar token
    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    const log = await Log.find({ token: token });
    if (!log) {
        return res.status(401).json({ message: "Token inválido" });
    }

    try {
        const direccion = req.query.direccion;
        const sofas = await Sofa.find({ direccion: { $regex: direccion, $options: "i" } });
        res.status(200).json(sofas);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar los sofas", error });
    }
});

sofaRouter.get("/buscar-coordenadas", async (req, res) => {
    const token = req.headers.authorization;

    // Validar token
    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    const log = await Log.find({ token: token });
    if (!log) {
        return res.status(401).json({ message: "Token inválido" });
    }

    try {
        // Acceder directamente a latitud y longitud desde req.query
        const { latitud, longitud } = req.query;

        console.log("Latitud:", latitud, "Longitud:", longitud);

        const sofas = await Sofa.find({
            "coordenadas.latitud": {
                $gte: parseFloat(latitud) - 0.4,
                $lte: parseFloat(latitud) + 0.4,
            },
            "coordenadas.longitud": {
                $gte: parseFloat(longitud) - 0.4,
                $lte: parseFloat(longitud) + 0.4,
            },
        });

        res.status(200).json(sofas);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar los sofas por coordenadas", error });
        console.log(error);
    }
});


module.exports = sofaRouter;
