import React, { useContext, useState, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Almacenar } from '../Almacenar';
import { toast } from 'react-toastify';
import { utilsError } from '../utilsError';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SOLICITUD_ACTUALIZACION':
      return { ...state, loadingUpdate: true };
    case 'ACTUALIZACION_EXITOSA':
      return { ...state, loadingUpdate: false };
    case 'ACTUALIZACION_FALLIDA':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function PantallaPerfilUser() {
  const { state, dispatch: ctxDispatch } = useContext(Almacenar);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const enviarControlador = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/usuarios/perfilUsuario',
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'SOLICITUD_ACTUALIZACION',
      });
      ctxDispatch({ type: 'INICIAR_SESION_USUARIO', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Usario actualizado satisfatoriamente');
    } catch (err) {
      dispatch({
        type: 'ACTUALIZACION_FALLIDA',
      });
      toast.error(utilsError(err));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>Perfil usuario</title>
      </Helmet>
      <h1 className="my-3">Perfil de usuario</h1>

      <form onSubmit={enviarControlador}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Actualizar</Button>
        </div>
      </form>
    </div>
  );
}
