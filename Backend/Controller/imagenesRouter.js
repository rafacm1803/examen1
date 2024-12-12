const express = require("express");
const router = express.Router();
const axios = require("axios");
const cloudinary = require("cloudinary").v2;

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: "dbyde2xwy",
    api_key: "967241115784697",
    api_secret: "3GfIPiluw3-4xicXG5YYoAmEE1w",
});

// Ruta para subir imágenes desde URL
router.post("/", async (req, res) => {
    try {
        console.log("Solicitud recibida en /imagenes");
        const { imageUrl } = req.body; // Recibimos la URL de la imagen desde el cuerpo de la solicitud

        if (!imageUrl) {
            return res.status(400).json({ message: "Debe proporcionar una URL de imagen" });
        }

        // Intentamos descargar la imagen desde la URL proporcionada
        const response = await axios({
            url: imageUrl,
            method: "GET",
            responseType: "arraybuffer",
        });

        const buffer = Buffer.from(response.data, "binary");

        // Subir la imagen a Cloudinary
        const uploadResult = await cloudinary.uploader.upload_stream(
            {
                folder: "examen",
                transformation: [
                    { quality: "auto", fetch_format: "auto" },
                    { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
                ],
            },
            (error, result) => {
                if (error) {
                    console.error("Error al subir la imagen: ", error.message);
                    return res.status(500).json({ message: "Error al subir la imagen", error: error.message });
                }
                // Devolvemos la URL de la imagen subida
                return res.status(200).json({
                    message: "Imagen subida correctamente",
                    url: result.secure_url,
                });
            }
        );

        uploadResult.end(buffer); // Iniciamos el proceso de subida
    } catch (error) {
        console.error("Error en el servidor:", error.message);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
});

module.exports = router;
