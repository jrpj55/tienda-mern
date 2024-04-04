const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        slug: { type: String, required: true },
        nombre: { type: String, required: true },
        cantidad: { type: Number, required: true },
        imagen: { type: String, required: true },
        precio: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      nombres: { type: String, required: true },
      address: { type: String, required: true },
      ciudad: { type: String, required: true },
      codigoPostal: { type: String, required: true },
      pais: { type: String, required: true },
      location: {
        lat: Number,
        lng: Number,
        address: String,
        name: String,
        vicinity: String,
        googleAddressId: String,
      },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrecio: { type: Number, required: true },
    envioPrecio: { type: Number, required: true },
    impuestoPrecio: { type: Number, required: true },
    totalPrecio: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pagado: { type: Boolean, default: false },
    fecha_pago: { type: Date },
    entregado: { type: Boolean, default: false },
    fecha_entrega: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = { Pedido };
