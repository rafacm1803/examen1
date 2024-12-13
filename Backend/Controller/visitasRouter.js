const express = require('express');
const mongoose = require('mongoose');
const usuarioRouter = require('./Controller/usuarioRouter');
const visitaRouter = require('./Controller/visitaRouter');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Conectar a la base de datos
mongoose.connect(process.env.NEXT_PUBLIC_MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a la base de datos'))
.catch((error) => console.error('Error al conectar a la base de datos:', error));

// Usar los routers
app.use('/api/usuarios', usuarioRouter);
app.use('/api/visitas', visitaRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});