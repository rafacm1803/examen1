const express = require('express');
const router = express.Router();
const Visita = require('../Model/visita');

// Añadir una visita al usuario
router.post('/:email/visitas', async (req, res) => {
  const { email } = req.params;
  const { ciudad, tokenOAuth } = req.body;

  try {
    const nuevaVisita = new Visita({
      usuarioEmail: email,
      ciudad,
      tokenOAuth
    });

    await nuevaVisita.save();
    res.status(201).json(nuevaVisita);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir la visita', error });
  }
});

// Obtener las visitas de un usuario
router.get('/:email/visitas', async (req, res) => {
  const { email } = req.params;

  try {
    const visitas = await Visita.find({ usuarioEmail: email }).sort({ timestamp: -1 });
    res.status(200).json(visitas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las visitas', error });
  }
});

// Obtener los marcadores de las visitas de un usuario
router.get('/:email/marcadores', async (req, res) => {
  const { email } = req.params;

  try {
    const visitas = await Visita.find({ usuarioEmail: email });
    const marcadores = visitas.map(visita => ({
      ciudad: visita.ciudad,
      timestamp: visita.timestamp,
      tokenOAuth: visita.tokenOAuth
    }));
    res.status(200).json(marcadores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los marcadores de las visitas', error });
  }
});

// Visualizar el mapa de otro usuario
router.get('/mapa/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const visitas = await Visita.find({ usuarioEmail: email }).sort({ timestamp: -1 });
    const marcadores = visitas.map(visita => ({
      ciudad: visita.ciudad,
      timestamp: visita.timestamp,
      tokenOAuth: visita.tokenOAuth
    }));

    res.status(200).json({ email, marcadores });
  } catch (error) {
    res.status(500).json({ message: 'Error al visualizar el mapa del usuario', error });
  }
});

module.exports = router;