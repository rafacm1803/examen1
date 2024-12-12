const express = require("express");
const logRouter = express.Router();
const log = require("../Model/log");

// GET ALL Logs
logRouter.get("/", async (req, res) => {
    try {
      const logs = await log.find();
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los logs", error });
    }
  });

//GET BY TOKEN
logRouter.get("/token/:token", async (req, res) => {
    try {
      const token = req.params.token;
      const logs = await log.find({ token: token });
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los logs", error });
    }
  });
  
  // GET Log by ID
  logRouter.get("/:id", async (req, res) => {
    try {
      const log = await log.findById(req.params.id);
      if (!log) {
        return res.status(404).json({ message: "Log no encontrado" });
      }
      res.status(200).json(log);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el log", error });
    }
  });
  
  // CREATE a new Log
  logRouter.post("/", async (req, res) => {
    const { email, tokenExpiry, token } = req.body;
  
    if (!email || !tokenExpiry || !token) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
  
    try {
      const newLog = new log({
        email,
        tokenExpiry,
        token,
      });
      const savedLog = await newLog.save();
      res.status(201).json(savedLog);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el log", error });
    }
  });
  
  // UPDATE a Log by ID
  logRouter.put("/:id", async (req, res) => {
    const { email, tokenExpiry, token } = req.body;
  
    try {
      const updatedLog = await log.findByIdAndUpdate(
        req.params.id,
        { email, tokenExpiry, token },
        { new: true, runValidators: true }
      );
  
      if (!updatedLog) {
        return res.status(404).json({ message: "Log no encontrado" });
      }
  
      res.status(200).json(updatedLog);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el log", error });
    }
  });
  
  // DELETE a Log by ID
  logRouter.delete("/:id", async (req, res) => {
    try {
      const deletedLog = await log.findByIdAndDelete(req.params.id);
  
      if (!deletedLog) {
        return res.status(404).json({ message: "Log no encontrado" });
      }
  
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el log", error });
    }
  });

module.exports = logRouter