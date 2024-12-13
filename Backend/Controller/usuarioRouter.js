const express = require('express');
const router = express.Router();
const Usuario = require('../Model/usuario');

// Crear un nuevo usuario
router.post('/crear', async (req, res) => {
  const { email, nombre } = req.body;

  try {
    const nuevoUsuario = new Usuario({ email, nombre });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error });
  }
});

// Obtener un usuario por email
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
});

// Actualizar un usuario
router.put('/:email', async (req, res) => {
  const { email } = req.params;
  const { nombre } = req.body;

  try {
    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { email },
      { nombre },
      { new: true }
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }
});

// Eliminar un usuario
router.delete('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const usuarioEliminado = await Usuario.findOneAndDelete({ email });
    if (!usuarioEliminado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error });
  }
});

// Añadir un marcador al usuario
router.post('/:email/marcadores', async (req, res) => {
  const { email } = req.params;
  const { pais, ciudad, latitud, longitud, imagenUrl } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.marcadores.push({ pais, ciudad, latitud, longitud, imagenUrl });
    await usuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir el marcador', error });
  }
});

// Obtener los marcadores de un usuario
router.get('/:email/marcadores', async (req, res) => {
  const { email } = req.params;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario.marcadores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los marcadores', error });
  }
});

// Añadir una visita al usuario
router.post('/:email/visitas', async (req, res) => {
  const { email } = req.params;
  const { emailVisitante, tokenOAuth } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.visitas.push({ emailVisitante, tokenOAuth });
    await usuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir la visita', error });
  }
});

// Obtener las visitas de un usuario
router.get('/:email/visitas', async (req, res) => {
  const { email } = req.params;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario.visitas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las visitas', error });
  }
});

module.exports = router;