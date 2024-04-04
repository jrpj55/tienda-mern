import React, { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Almacenar } from '../Almacenar.js';
import { toast } from 'react-toastify';
import { utilsError } from '../utilsError.js';

export function PantallaRegistroUsuario() {
  const navigate = useNavigate();

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  //definimos los estados del email y password
  const [name, colocarName] = useState('');
  const [email, colocarEmail] = useState('');
  const [password, colocarPassword] = useState('');
  const [confirmPassword, colocarConfirmPassword] = useState('');

  //definimos el contexto e información del usuario
  const { state, dispatch: ctxDespachar } = useContext(Almacenar);
  const { userInfo } = state;

  const enviarControlador = async (e) => {
    e.preventDefault(); //predeterminado para evitar la actualización de la página cuando el usuario hace click en inicio de sesión
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      //vamos a llamar la api que creamos en el backen de inicio de sesión
      const { data } = await axios.post('/api/usuarios/registroUsuario', {
        name,
        email,
        password,
      });

      ctxDespachar({ type: 'INICIAR_SESION_USUARIO', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(utilsError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Registro de usuario</title>
      </Helmet>
      {/**el classname='my-3' es una clase de bootstrap que le da el top del titulo inicio de sesion  **/}
      <h1 className="my-3">Registro usuario</h1>
      <Form onSubmit={enviarControlador}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>name</Form.Label>
          {/** Creamos un cuadro de entrada o cuadro de texto para recibier el email**/}
          <Form.Control
            onChange={(e) => colocarName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          {/** Creamos un cuadro de entrada o cuadro de texto para recibier el email**/}
          <Form.Control
            type="email"
            required
            onChange={(e) => colocarEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          {/** Creamos un cuadro de entrada o cuadro de texto para recibier el email**/}
          <Form.Control
            type="password"
            required
            onChange={(e) => colocarPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirmar Password</Form.Label>
          {/** Creamos un cuadro de entrada o cuadro de texto para recibier el email**/}
          <Form.Control
            type="password"
            required
            onChange={(e) => colocarConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Registrar usuario</Button>
        </div>
        <div className="mb-3">
          Ya tienes una cuenta?{' '}
          <Link to={`/inicioSesion?redirect=${redirect}`}>Iniciar sesión</Link>
        </div>
      </Form>
    </Container>
  );
}
export default PantallaRegistroUsuario;
