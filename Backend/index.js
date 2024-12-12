const express = require('express');
const connectBD = require('./bd');
const cors = require("cors");

const app = express();
const port = 3000;

// Llama a la función para conectar a la base de datos
connectBD();

// Configurar middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API del parcial 3!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
