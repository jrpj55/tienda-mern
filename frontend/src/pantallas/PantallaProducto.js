import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import Rating from '../componentes/Rating';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import CajaDeCarga from '../componentes/CajaDeCarga';
import BuzonDeMensaje from '../componentes/BuzonDeMensaje';
import { utilsError } from '../utilsError';
import { Almacenar } from '../Almacenar';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SOLICITUD_RECUPERACION':
      return { ...state, loading: true };
    case 'BUSCAR_EXITO':
      return { ...state, articulo: action.payload, loading: false };
    case 'FALLA_RECUPERACION':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function PantallaProducto() {
  const navigate = useNavigate();
  const parametros = useParams();
  const { slug } = parametros;

  const [{ loading, error, articulo }, dispatch] = useReducer(reducer, {
    articulo: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const recuperarDatos = async () => {
      dispatch({ type: 'SOLICITUD_RECUPERACION' });
      try {
        const resultado = await axios.get(`/api/productos/slug/${slug}`);
        dispatch({ type: 'BUSCAR_EXITO', payload: resultado.data });
      } catch (error) {
        dispatch({ type: 'FALLA_RECUPERACION', payload: utilsError(error) });
      }
    };
    recuperarDatos();
  }, [slug]);

  //defino la funcion de agregarControladorCarrito
  const { state, dispatch: ctxDispatch } = useContext(Almacenar);
  const { cart } = state;
  const AgregarControladorCarrito = async () => {
    //Linea de codigo para saber si existe el articulo  en el carrito o no
    const existItem = cart.cartItems.find((x) => x._id === articulo._id);
    const cantidad = existItem ? existItem.cantidad + 1 : 1;
    const { data } = await axios.get(`/api/productos/${articulo._id}`);
    //si el inventario es manor que la cantidad solicitada entonces mensaje
    if (data.inventario < cantidad) {
      window.alert('...Lo siento. No hay productos en el inventario...');
      return;
    }
    ctxDispatch({
      type: 'AGREGAR_CARRITO_ARTICULO',
      payload: { ...articulo, cantidad },
    });
    navigate('/cart');
  };

  return loading ? (
    <CajaDeCarga />
  ) : error ? (
    <BuzonDeMensaje variant="danger">{error}</BuzonDeMensaje>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={articulo.imagen}
            alt={articulo.nombre}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              {/*Helmet nos sirve para colocar el titulo en la pestaña d ela ventana*/}
              <Helmet>
                <title>{articulo.nombre}</title>
              </Helmet>

              <h1>{articulo.nombre}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={articulo.calificacion}
                numReviews={articulo.numopiniones}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Precio : ${articulo.precio}</ListGroup.Item>
            <ListGroup.Item>
              Descripción : ${articulo.descripcion}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Precio:</Col>
                    <Col>${articulo.precio}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Estado:</Col>
                    <Col>
                      {articulo.inventario > 0 ? (
                        <Badge bg="success">Disponible</Badge>
                      ) : (
                        <Badge bg="danger">No disponible</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {articulo.inventario > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        onClick={AgregarControladorCarrito}
                        variant="primary"
                      >
                        Carrito
                      </Button>
                    </div>
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

export default PantallaProducto;
