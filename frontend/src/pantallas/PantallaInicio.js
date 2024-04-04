import { useEffect, useReducer } from 'react';
//import datos from '../datos'; quitamos los datos estaticos
//import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Articulo from '../componentes/Articulo';
import { Helmet } from 'react-helmet-async';
import CajaDeCarga from '../componentes/CajaDeCarga';
import BuzonDeMensaje from '../componentes/BuzonDeMensaje';

//definimos un reductor funcional acepta 2 parametros
//state= es el estado atual y la segunda es la acción que cambia elk estado

const reducer = (state, action) => {
  switch (action.type) {
    case 'SOLICITUD_RECUPERACION':
      return { ...state, loading: true };
    case 'BUSCAR_EXITO':
      /*action.payload contiene todos los productos desde el backend*/
      return { ...state, articulos: action.payload, loading: false };
    case 'FALLA_RECUPERACION':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function PantallaInicio() {
  //reemplazamos la const [articulos, establecerArticulos] = useState([]); por la siguiente funcion
  const [{ loading, error, articulos }, dispatch] = useReducer(
    logger(reducer),
    {
      articulos: [],
      loading: true,
      error: '',
    }
  );
  //definimos un estado para productos-devuelme una matriz de una variable y una función
  //const [articulos, establecerArticulos] = useState([]);
  //utilizamos useEffect que acepta 2 parametros
  //1 parametro
  useEffect(() => {
    //llamamos a una api y obtenemos productos desde el backend
    //función recuperar datos
    const recuperarDatos = async () => {
      dispatch({ type: 'SOLICITUD_RECUPERACION' });
      try {
        const resultado = await axios.get('/api/productos');
        dispatch({ type: 'BUSCAR_EXITO', payload: resultado.data });
      } catch (error) {
        dispatch({ type: 'FALLA_RECUPERACION', payload: error.message });
      }

      //establecerArticulos(resultado.data);
    };
    recuperarDatos();
    //segundo parametro
  }, []);

  return (
    <div>
      <Helmet>
        <title>ALPA INVERSIONES S.A.S</title>
      </Helmet>
      <h1>Lista de Productos</h1>
      <div className="articulos">
        {loading ? (
          <CajaDeCarga />
        ) : error ? (
          <BuzonDeMensaje variant="danger">{error}</BuzonDeMensaje>
        ) : (
          <Row>
            {articulos.map((articulo) => (
              //tamaños de las pantallas para qu el muestre el  numero de articulos
              <Col key={articulo.slug} sm={6} md={4} lg={3} className="mb-3">
                {/*Llamamos el componente Articulo*/}
                <Articulo articulo={articulo}></Articulo>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default PantallaInicio;
