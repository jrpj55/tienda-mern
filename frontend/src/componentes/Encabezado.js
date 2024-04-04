import { useContext } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Almacenar } from '../Almacenar';

function Encabezado() {
  const { state, dispatch: ctxDespachar } = useContext(Almacenar);
  const { cart, userInfo } = state;

  const controladorCerrarSesion = () => {
    ctxDespachar({ type: 'CERRAR_SESION_USUARIO' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/inicioSesion';
  };

  return (
    <div>
      <header>
        <Navbar bg="dark" variant="dark">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>ALPA INVERSIONES S.A.S</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto" w-100 justify-content-end>
                <Link to="/cart" className="nav-link">
                  carrito
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.cantidad, 0)}
                    </Badge>
                  )}
                </Link>
                {/*Información del usuario registrado, si existe (nombre usuario y un menu) o no existe (boton de inicio de sesión)*/}
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/perfilUsuario">
                      <NavDropdown.Item>Perfil de usuario</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/historialPedidos">
                      <NavDropdown.Item>Historial de pedidos</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#cerrarSesion"
                      onClick={controladorCerrarSesion}
                    >
                      Cerrar Sesión
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/inicioSesion">
                    Iniciar Sesión
                  </Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  );
}

export default Encabezado;
