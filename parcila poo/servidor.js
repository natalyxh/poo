const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB bebe'))
  .catch((err) => console.error('error al conectar a MongoDB', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));