// index.js
const express = require("express");
const cors = require("cors");
const connectBD = require("./bd"); // Importa la función de conexión

require('dotenv').config(); // Carga las variables de entorno del archivo .env

const app = express();
const PORT = process.env.PORT || 3000;

// Llama a la función para conectar a la base de datos
connectBD();

// Configurar middlewares
app.use(express.json());
app.use(cors());

// Ruta básica para manejar GET /
app.get('/', (req, res) => {
    res.send("¡Bienvenido a la API del Examen 1!");
});



const logRouter = require("./Controller/logRouter");
app.use("/log", logRouter);

const imagenesRouter = require("./Controller/imagenesRouter");
app.use("/imagenes", imagenesRouter);

const mapasRouter = require("./Controller/mapasRouter");
app.use("/mapas", mapasRouter);

// Rutas
const sofaRouter = require("./Controller/sofaRouter");
app.use("/sofa", sofaRouter);

const reservaRouter = require("./Controller/reservaRouter");
app.use("/reserva", reservaRouter);


app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

