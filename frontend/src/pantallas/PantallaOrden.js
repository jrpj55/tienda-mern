import React, { useReducer, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import BuzonDeMensaje from '../componentes/BuzonDeMensaje';
import CajaDeCarga from '../componentes/CajaDeCarga';
import { Almacenar } from '../Almacenar';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { utilsError } from '../utilsError';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'SOLICITUD_RECUPERACION':
      return { ...state, loading: true, error: '' };
    case 'OBTENIENDO_EXITO':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'SOLICITUD_FALLIDA':
      return { ...state, loading: false, error: action.payload };
    case 'SOLICITUD_PAGO':
      return { ...state, loadingPay: true };
    case 'PAGO_EXITOSO':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAGO_FALLIDO':
      return { ...state, loadingPay: false };
    case 'RESTABLECER_PAGO':
      return { ...state, loadingPay: false, successPay: false };

    default:
      return state;
  }
}

export default function PantallaOrden() {
  const { state } = useContext(Almacenar);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order, loadingPay, successPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrecio },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/pedidos/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAGO_EXITOSO', payload: data });
        toast.success('El pedido esta pagado');
      } catch (err) {
        dispatch({ type: 'PAGO_FALLIDO', payload: utilsError(err) });
        toast.error(utilsError(err));
      }
    });
  }
  function onError(err) {
    toast.error(utilsError(err));
  }

  useEffect(() => {
    const buscarOrden = async () => {
      try {
        dispatch({ type: 'SOLICITUD_RECUPERACION' });
        const { data } = await axios.get(`/api/pedidos/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'OBTENIENDO_EXITO', payload: data });
      } catch (err) {
        dispatch({ type: 'SOLICITUD_FALLIDA', payload: utilsError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/inicioSesion');
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      buscarOrden();
      if (successPay) {
        dispatch({ type: 'RESTABLECER_PAGO' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, navigate, orderId, paypalDispatch, successPay]);

  return loading ? (
    <CajaDeCarga></CajaDeCarga>
  ) : error ? (
    <BuzonDeMensaje variant="danger">{error}</BuzonDeMensaje>
  ) : (
    <div>
      <Helmet>
        <title>Orden {orderId}</title>
      </Helmet>
      <h1 className="my-3">Orden {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Datos de envío</Card.Title>
              <Card.Text>
                <strong>Nombres:</strong> {order.shippingAddress.nombres} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.ciudad},{' '}
                {order.shippingAddress.codigoPostal},
                {order.shippingAddress.pais}
              </Card.Text>
              {order.entregado ? (
                <BuzonDeMensaje variant="success">
                  Entregado en: {order.entregado}
                </BuzonDeMensaje>
              ) : (
                <BuzonDeMensaje variant="danger">No entregado</BuzonDeMensaje>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pago</Card.Title>
              <Card.Text>
                <strong>Metodo:</strong> {order.paymentMethod}
              </Card.Text>
              {order.pagado ? (
                <BuzonDeMensaje variant="success">
                  Pagado en: {order.pagado}
                </BuzonDeMensaje>
              ) : (
                <BuzonDeMensaje variant="danger">No pagado</BuzonDeMensaje>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
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
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Resumen de la orden</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items-Subtotal</Col>
                    <Col>${order.itemsPrecio.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Costo envío</Col>
                    <Col>${order.envioPrecio.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Impuesto</Col>
                    <Col>${order.impuestoPrecio.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Pago Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrecio.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.pagado && (
                  <ListGroup.Item>
                    {isPending ? (
                      <CajaDeCarga />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <CajaDeCarga></CajaDeCarga>}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
