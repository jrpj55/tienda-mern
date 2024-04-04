const bcrypt = require('bcryptjs');

const datos = {
  usuarios: [
    {
      name: 'José Raimundo Pabón Jiménez',
      email: 'jrpj55@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],

  articulos: [
    {
      nombre: 'Nike Slim shirt',
      slug: 'nike-slim-shirt',
      categoria: 'Camisas',
      imagen: '/images/p1.jpg', // 679px × 829px
      precio: 120,
      inventario: 2,
      marca: 'Nike',
      calificacion: 4.5,
      numopiniones: 10,
      descripcion: 'high quality shirt',
    },
    {
      nombre: 'Adidas Fit Shirt',
      slug: 'adidas-fit-shirt',
      categoria: 'Camisas',
      imagen: '/images/p2.jpg',
      precio: 250,
      inventario: 20,
      marca: 'Adidas',
      calificacion: 4.0,
      numopiniones: 10,
      descripcion: 'high quality product',
    },
    {
      nombre: 'Nike Slim Pant',
      slug: 'nike-slim-pant',
      categoria: 'Pantalones',
      imagen: '/images/p3.jpg',
      precio: 25,
      inventario: 15,
      marca: 'Nike',
      calificacion: 4.5,
      numopiniones: 14,
      descripcion: 'high quality product',
    },
    {
      nombre: 'Adidas Fit Pant',
      slug: 'adidas-fit-pant',
      categoria: 'Pantalones',
      imagen: '/images/p4.jpg',
      precio: 65,
      inventario: 5,
      marca: 'Puma',
      calificacion: 4.5,
      numopiniones: 10,
      descripcion: 'high quality product',
    },
  ],
};
module.exports = { datos };
