const express = require('express');
const { Articulos } = require('../models/modelArticulos.js');

const productosRouter = express.Router();

//Función que me muestra todos los articulos en el inicio
productosRouter.get('/', async (req, res) => {
  const todosArticulos = await Articulos.find();
  res.send(todosArticulos);
});

//Función de mostrar por slug del articulo
productosRouter.get('/slug/:slug', async (req, res) => {
  const slugArticulo = await Articulos.findOne({ slug: req.params.slug });
  if (slugArticulo) {
    res.send(slugArticulo);
  } else {
    res.status(404).send({ message: 'Articulo no encontrado...' });
  }
});

//Función de encontrar articulo por id
productosRouter.get('/:id', async (req, res) => {
  const idArticulo = await Articulos.findById(req.params.id);
  if (idArticulo) {
    res.send(idArticulo);
  } else {
    res.status(404).send({ message: 'Articulo no encontrado...' });
  }
});

module.exports = { productosRouter };
