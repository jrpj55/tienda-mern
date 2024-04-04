const express = require('express');
const { Usuarios } = require('../models/modelUsuarios.js');
const bcrypt = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { generarToken, isAuth } = require('../utils.js');

const usuariosRouter = express.Router();

//Función de inicio de sesión
usuariosRouter.post(
  '/inicioSesion',
  expressAsyncHandler(async (req, res) => {
    const userToken = await Usuarios.findOne({
      email: req.body.email,
    });
    if (userToken) {
      if (bcrypt.compareSync(req.body.password, userToken.password)) {
        res.send({
          _id: userToken._id,
          name: userToken.name,
          email: userToken.email,
          isAdmin: userToken.isAdmin,
          token: generarToken(userToken),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Email o Password incorrecto' });
  })
);

//Función registrar usuarios
usuariosRouter.post(
  '/registroUsuario',
  expressAsyncHandler(async (req, res) => {
    const newUser = new Usuarios({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const userToken = await newUser.save();
    res.send({
      _id: userToken._id,
      name: userToken.name,
      email: userToken.email,
      isAdmin: userToken.isAdmin,
      token: generarToken(userToken),
    });
  })
);

//actualizar usuario registrado
usuariosRouter.put(
  '/perfilUsuario',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await Usuarios.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const actualizarUsuario = await user.save();
      res.send({
        _id: actualizarUsuario._id,
        name: actualizarUsuario.name,
        email: actualizarUsuario.email,
        isAdmin: actualizarUsuario.isAdmin,
        token: generarToken(actualizarUsuario),
      });
    } else {
      res.status(404).send({ message: 'Usuario no actualizado' });
    }
  })
);

module.exports = { usuariosRouter };
