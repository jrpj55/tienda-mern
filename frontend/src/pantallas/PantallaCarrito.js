import React, { useContext } from 'react';
import { Almacenar } from '../Almacenar';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import BuzonDeMensaje from '../componentes/BuzonDeMensaje';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PantallaCarrito() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Almacenar);

  const {
    cart: { cartItems },
  } = state;

  const ActualizarControladorCarrito = async (item, cantidad) => {
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

  const EliminarControladorCarrito = (item) => {
    ctxDispatch({ type: 'ELIMINAR_ITEM_CARRITO', payload: item });
  };

  const ProcesoDePago = () => {
    navigate('/inicioSesion?redirect=/datosEnvios');
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Carro de Compras</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <BuzonDeMensaje>
              Carrito esta vacio. <Link to="/">Ir de Compras</Link>
            </BuzonDeMensaje>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/producto/${item.slug}`}>{item.nombre}</Link>
                    </Col>
                    <Col md={3}>
                      {/*Los botones con iconos de -minus y +plus */}
                      <Button
                        variant="light"
                        onClick={() =>
                          ActualizarControladorCarrito(item, item.cantidad - 1)
                        }
                        disabled={item.cantidad === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.cantidad}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() =>
                          ActualizarControladorCarrito(item, item.cantidad + 1)
                        }
                        disabled={item.cantidad === item.inventario}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${item.precio}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => EliminarControladorCarrito(item)}
                        variant="light"
                      >
                        {/*Los botones con icono de eliminar(fas fa-trash) */}
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.cantidad, 0)}{' '}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.precio * c.cantidad, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={ProcesoDePago}
                      disabled={cartItems.length === 0}
                    >
                      Proceso de Pago
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
