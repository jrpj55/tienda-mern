import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { utilsError } from '../utilsError';
import { Almacenar } from '../Almacenar';
import PasosdePago from '../componentes/PasosdePago';
import BuzondeMensaje from '../componentes/BuzonDeMensaje';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PantallaRealizarPedido() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Almacenar);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrecio = round2(
    cart.cartItems.reduce((a, c) => a + c.cantidad * c.precio, 0)
  );
  //cart.envioPrecio = cart.itemsPrecio > 100 ? round2(0) : round2(10);
  cart.envioPrecio = cart.itemsPrecio >= 1 ? round2(0) : round2(10);
  //cart.impuestoPrecio = round2(0.15 * cart.itemsPrecio);
  cart.impuestoPrecio = round2(0 * cart.itemsPrecio);
  cart.totalPrecio = cart.itemsPrecio + cart.envioPrecio + cart.impuestoPrecio;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        '/api/pedidos',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrecio,
          shippingPrice: cart.envioPrecio,
          taxPrice: cart.impuestoPrecio,
          totalPrice: cart.totalPrecio,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'BORRAR_CARRITO' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(utilsError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/metodoPago');
    }
  }, [cart, navigate]);

  return (
    <div>
      <PasosdePago paso1 paso2 paso3 paso4></PasosdePago>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Dirección de envío</Card.Title>
              <Card.Text>
                <strong>Nombre:</strong> {cart.shippingAddress.nombres} <br />
                <strong>Dirección: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.ciudad},{' '}
                {cart.shippingAddress.codigoPostal},{cart.shippingAddress.pais}
              </Card.Text>
              <Link to="/datosEnvios">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Metodo de Pago</Card.Title>
              <Card.Text>
                <strong>Metodo:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/metodoPago">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/articulo/${item.slug}`}>{item.nombre}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.cantidad}</span>
                      </Col>
                      <Col md={3}>${item.precio}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Resumen del pedido</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrecio.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Envío</Col>
                    <Col>${cart.envioPrecio.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Impuesto</Col>
                    <Col>${cart.impuestoPrecio.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Total del pedido</strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrecio.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Realizar pedido
                    </Button>
                  </div>
                  {loading && <BuzondeMensaje></BuzondeMensaje>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
