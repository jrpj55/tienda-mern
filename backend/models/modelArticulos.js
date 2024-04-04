const mongoose = require('mongoose');

const articuloSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    categoria: { type: String, required: true },
    imagen: { type: String, required: true },
    precio: { type: Number, required: true },
    inventario: { type: Number, required: true },
    marca: { type: String, required: true },
    calificacion: { type: Number, required: true },
    numopiniones: { type: Number, required: true },
    descripcion: { type: String, required: true },
  },
  {
    //con esta instrucción se generan dos campo de hora de creación y hora de actualización
    timestamps: true,
  }
);

const Articulos = mongoose.model('Articulos', articuloSchema);

module.exports = { Articulos };
