// bd.js
const mongoose = require('mongoose');

async function connectBD() {
    const user = "admin";
    const password = "admin";
    const dbName = "examen1";

    try {
        await mongoose.connect(`mongodb+srv://${user}:${password}@examen3.icokr.mongodb.net/${dbName}`, {
        });
        console.log("BDD disponible");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
}

module.exports = connectBD;
