const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    peso: Number
});

module.exports = mongoose.model('Producto', productoSchema);
