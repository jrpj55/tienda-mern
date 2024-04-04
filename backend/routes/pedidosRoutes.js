const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { Pedido } = require('../models/modelPedido');
const { Usuarios } = require('../models/modelUsuarios');
const { Articulos } = require('../models/modelArticulos');
const { isAuth } = require('../utils');

const pedidoRouter = express.Router();

//crear la función de guardar un pedido
pedidoRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Pedido({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrecio: req.body.itemsPrice,
      envioPrecio: req.body.shippingPrice,
      impuestoPrecio: req.body.taxPrice,
      totalPrecio: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'Nuevo pedido creado', order });
  })
);

//función listar los pedidos por el que esta registrado
pedidoRouter.get(
  '/mios',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Pedido.find({ user: req.user._id });
    res.send(orders);
  })
);

//encontrar por id
pedidoRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Pedido.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Orden no encontrado' });
    }
  })
);

//identificar el pedido para el pago
pedidoRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Pedido.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.pagado = true;
      order.fecha_pago = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const actualizarPedido = await order.save();
      res.send({ message: 'Pedido pagado', order: actualizarPedido });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

module.exports = { pedidoRouter };
