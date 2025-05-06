const mongoose = require('mongoose');

const envioSchema = new mongoose.Schema({
    usuarioId: String,
    nombre: String,
    direccion: String,
    telefono: String,
    referencia: String,
    observacion: String,
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto'
    },
    costo: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Envio', envioSchema);
