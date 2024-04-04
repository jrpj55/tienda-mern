import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PantallaInicio from './pantallas/PantallaInicio.js';
import PantallaProducto from './pantallas/PantallaProducto.js';
import Container from 'react-bootstrap/Container';
import Encabezado from './componentes/Encabezado.js';
import PantallaCarrito from './pantallas/PantallaCarrito.js';
import { PantallaInicioSesion } from './pantallas/PantallaInicioSesion.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PantallaDireccionEnvio from './pantallas/PantallaDireccionEnvio.js';
import PantallaRegistroUsuario from './pantallas/PantallaRegistroUsuario.js';
import PantallaMetodoPago from './pantallas/PantallaMetodoPago.js';
import PantallaRealizarPedido from './pantallas/PantallaRealizarPedido.js';
import PantallaOrden from './pantallas/PantallaOrden.js';
import PantallaOderHistorial from './pantallas/PantallaOderHistorial.js';
import PantallaPerfilUser from './pantallas/PantallaPerfilUser.js';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <Encabezado />

        <main>
          <Container className="mt-3">
            <Routes>
              {/*Ruta para descripcion de un articulo*/}
              <Route path="/articulo/:slug" element={<PantallaProducto />} />
              {/*Ruta de la pantalla de inicio*/}
              <Route path="/" element={<PantallaInicio />} />
              {/*Ruta del Carro de Compras*/}
              <Route path="/cart" element={<PantallaCarrito />} />
              {/*Ruta para IniciarSesión*/}
              <Route path="/inicioSesion" element={<PantallaInicioSesion />} />
              {/*Ruta para Dirección de envío*/}
              <Route path="/datosEnvios" element={<PantallaDireccionEnvio />} />
              {/*Ruta para Registrar usuario*/}
              <Route
                path="/registroUsuario"
                element={<PantallaRegistroUsuario />}
              />
              {/*Ruta para Pantalla metodo de pago*/}
              <Route
                path="/metodoPago"
                element={<PantallaMetodoPago />}
              ></Route>
              {/*Ruta para Pantalla Realizar pedido*/}
              <Route
                path="/realizarPedido"
                element={<PantallaRealizarPedido />}
              />
              <Route path="/order/:id" element={<PantallaOrden />} />
              <Route
                path="/historialPedidos"
                element={<PantallaOderHistorial />}
              ></Route>
              <Route
                path="/perfilUsuario"
                element={<PantallaPerfilUser />}
              ></Route>
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">
            Derechos reservados de autor "Raychu"
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
