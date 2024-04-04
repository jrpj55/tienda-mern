const mongoose = require('mongoose');

const usuariosSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
  },
  {
    //con esta instrucción se generan dos campo de hora de creación y hora de actualización
    timestamps: true,
  }
);

const Usuarios = mongoose.model('Usuarios', usuariosSchema);

module.exports = { Usuarios };
