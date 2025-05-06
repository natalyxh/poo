const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const envioService = require('../services/envioS');
const Usuario = require('../models/usuario');
const Envio = require('../models/envio');
const Producto = require('../models/producto');

//Créditos disponibles
router.get('/usuario/:id/credito', async (req, res) => {
    try {
        console.log("Buscando usuario con el ID:", req.params.id);

        const usuario = await Usuario.findOne({ usuarioId: String(req.params.id) });
        
        console.log("Usuario encontrado:", usuario);

        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        res.json({ credito: usuario.credito });
    } catch (err) {
        console.error("❌ Error al obtener créditos:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Obtener todos los envíos o los envíos de un usuario específico
router.get('/envios', async (req, res) => {
    try {
        const { usuarioId } = req.query;
        let envios;

        if (usuarioId) {
            
            envios = await Envio.find({ usuarioId }).populate('producto');
        } else {
            
            envios = await Envio.find().populate('producto');
        }

        if (envios.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron envíos' });
        }

        res.json(envios);
    } catch (err) {
        console.error("❌ Error al obtener envíos:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


//Comprar créditos
router.post('/usuario/:id/comprar-creditos', async (req, res) => {
    try {
        const { paquete } = req.body;
        const usuario = await Usuario.findOne({ usuarioId: req.params.id });

        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        const paquetes = { "30": 30, "40": 40, "60": 60 };
        const creditos = paquetes[paquete];

        if (!creditos) return res.status(400).json({ mensaje: 'Paquete inválido' });

        usuario.credito += creditos;
        await usuario.save();

        res.json({ mensaje: 'Créditos añadidos exitosamente', nuevoCredito: usuario.credito });
    } catch (err) {
        console.error("❌ Error al comprar créditos:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Registrar nuevo envío
router.post('/envios', async (req, res) => {
    try {
        const envio = await envioService.registrarEnvio(req.body);
        res.json({ mensaje: 'Envío registrado', envio });
    } catch (err) {
        console.error("❌ Error al registrar envío:", err);
        res.status(400).json({ error: err.message });
    }
});

//Obtener envíos de un usuario
router.get('/envios/:usuarioId', async (req, res) => {
    try {
        const envios = await Envio.find({ usuarioId: req.params.usuarioId }).populate('producto');
        res.json(envios);
    } catch (err) {
        console.error("❌ Error al consultar envíos:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Obtener todos los productos
router.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        if (productos.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos' });
        }
        res.json(productos);
    } catch (err) {
        console.error("❌ Error al obtener productos:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Obtener un producto por su ID
router.get('/producto/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (err) {
        console.error("❌ Error al obtener producto:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.post('/productos', async (req, res) => {
    try {
        const { nombre, descripcion, peso } = req.body;

        const producto = new Producto({ nombre, descripcion, peso });
        await producto.save();

        res.json({ mensaje: 'Producto registrado exitosamente', producto });
    } catch (err) {
        console.error("❌ Error al registrar producto:", err);
        res.status(500).json({ error: 'Error al registrar producto' });
    }
});

//eliminar envío y reembolsar créditos
router.delete('/envios/:envioId', async (req, res) => {
    try {
        const envioId = req.params.envioId;

        if (!mongoose.Types.ObjectId.isValid(envioId)) {
            return res.status(400).json({ mensaje: 'ID de envío no válido' });
        }

        const envio = await Envio.findById(envioId).populate('producto');
        if (!envio) return res.status(404).json({ mensaje: 'Envío no encontrado' });

        const usuario = await Usuario.findOne({ usuarioId: envio.usuarioId });
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

        if (isNaN(usuario.credito)) {
            return res.status(400).json({ error: 'El crédito del usuario no es un número válido' });
        }

        // Verificar el peso del producto y el cálculo del crédito
        const peso = envio.producto.peso;
        console.log("Peso del producto:", peso);

        const creditoRestaurado = peso <= 3 ? 1 : Math.ceil(peso / 3);
        console.log("Crédito restaurado calculado:", creditoRestaurado);

        if (isNaN(creditoRestaurado)) {
            return res.status(400).json({ error: 'El crédito calculado para reembolso no es válido' });
        }

        // Restablecer los créditos del usuario
        usuario.credito += creditoRestaurado;
        await usuario.save();
        await envio.deleteOne();

        res.json({ mensaje: 'Envío eliminado y crédito reembolsado' });
    } catch (err) {
        console.error("❌ Error al eliminar envío:", err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;
