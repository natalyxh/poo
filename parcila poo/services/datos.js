const mongoose = require('mongoose');

async function conectarDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/postmail');
        console.log('Conexión a MongoDB exitosa');
    } catch (err) {
        console.error(' Error al conectar a MongoDB:', err);
        process.exit(1); // Finaliza si no conecta
    }
}

module.exports = conectarDB;

