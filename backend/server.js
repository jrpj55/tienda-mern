const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedRouter } = require('./routes/seedRoutes.js');
const { productosRouter } = require('./routes/productosRoutes.js');
const { usuariosRouter } = require('./routes/usuariosRoutes.js');
const { pedidoRouter } = require('./routes/pedidosRoutes.js');

dotenv.config();

const app = express();

//necesitamos esta dos linea de codigo para la solicitud de jwtwebtoken
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb'); //sb es sandbox
});

app.use('/api/seed', seedRouter);
app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/pedidos', pedidoRouter);

//Un controlador de errores este es como un middleware
app.use((err, req, res, next) => {
  //500 es un error del servidor
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI_LOCAL, (error) => {
  if (error) throw error;

  app.listen(port, () => {
    console.log('######################');
    console.log('###### API REST ######');
    console.log('######################');
    console.log(`http://localhost:${port}`);
    console.log('Conectado a la Base de datos');
  });
});
