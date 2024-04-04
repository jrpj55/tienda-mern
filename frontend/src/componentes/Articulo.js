import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from '../componentes/Rating';
import axios from 'axios';
import { Almacenar } from '../Almacenar';

function Articulo(props) {
  const { articulo } = props;

  const { state, dispatch: ctxDispatch } = useContext(Almacenar);
  const {
    cart: { cartItems },
  } = state;

  const AdicionarControladorCarrito = async (item) => {
    const existItem = cartItems.find((x) => x._id === articulo._id);
    const cantidad = existItem ? existItem.cantidad + 1 : 1;

    const { data } = await axios.get(`/api/productos/${item._id}`);
    if (data.inventario < cantidad) {
      window.alert('Lo siento. No hay productos en el inventario');
      return;
    }
    ctxDispatch({
      type: 'AGREGAR_CARRITO_ARTICULO',
      payload: { ...item, cantidad },
    });
  };

  return (
    <Card>
      <Link to={`/articulo/${articulo.slug}`}>
        <img
          src={articulo.imagen}
          className="card-img-top"
          alt={articulo.nombre}
        />
      </Link>
      <Card.Body>
        <Link to={`/articulo/${articulo.slug}`}>
          <Card.Title>{articulo.nombre}</Card.Title>
        </Link>
        <Rating
          rating={articulo.calificacion}
          numReviews={articulo.numopiniones}
        />
        <Card.Text>${articulo.precio}</Card.Text>
        {articulo.inventario === 0 ? (
          <Button variant="light" disabled>
            No hay
          </Button>
        ) : (
          <Button onClick={() => AdicionarControladorCarrito(articulo)}>
            Adicionar a Carrito
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Articulo;
