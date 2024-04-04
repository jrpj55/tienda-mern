//función de adicionar productos del arreglo a la base de datos mongoose
const express = require('express');
const { Articulos } = require('../models/modelArticulos.js');
const { Usuarios } = require('../models/modelUsuarios.js');
const { datos } = require('../datos.js');

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  //esta instrucción quita los artículos que se crean cuando vuelves a cargar el backend
  await Articulos.remove({});
  const createdProducts = await Articulos.insertMany(datos.articulos);
  await Usuarios.remove({});
  const createdUsers = await Usuarios.insertMany(datos.usuarios);

  res.send({ createdProducts, createdUsers });
});

module.exports = { seedRouter };
