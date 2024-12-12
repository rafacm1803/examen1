const express = require("express");
const reservaRouter = express.Router();
const reserva = require("../Model/reserva");
const sofa = require("../Model/sofa");
const Log = require("../Model/log");

//Todas las comunicaciones con el backend serán autenticadas mediante el ID token, de forma que se verifique la identidad de las operaciones realizadas

////////////////////////////////////////////////////////////////
//FUNCIONALIDAD
////////////////////////////////////////////////////////////////

//Dado un sofa (por anfitrion), sacar sus reservas ordenadas por fecha
reservaRouter.get("/:anfitrion", async (req, res) => {
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
        const anfitrion = req.params.anfitrion;
        const reservas = await reserva.find({ anfitrion }).sort({ desde: 1 });
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las reservas", error });
    }
});

//Reservar dado un anfitrion
reservaRouter.post("/", async (req, res) => {
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
        const { anfitrion, huesped, desde, dias } = req.body;
        const newReserva = new reserva({
            anfitrion,
            huesped,
            desde,
            dias,
        });
        const savedReserva = await newReserva.save();
        res.status(201).json(savedReserva);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la reserva", error });
    }
});

module.exports = reservaRouter