import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Almacenar } from '../Almacenar';
import PasosdePago from '../componentes/PasosdePago';

export default function PantallaDireccionEnvio() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Almacenar);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [nombres, setNombres] = useState(shippingAddress.nombres || '');
  const [address, setDireccion] = useState(shippingAddress.address || '');
  const [ciudad, setCiudad] = useState(shippingAddress.ciudad || '');
  const [codigoPostal, setCodigoPostal] = useState(
    shippingAddress.codigoPostal || ''
  );
  const [pais, setPais] = useState(shippingAddress.pais || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/inicioSesion?redirect=/datosEnvios');
    }
  }, [userInfo, navigate]);

  const ButtonControlador = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'GUARDAR_DIRECCION_ENVIO',
      payload: {
        nombres,
        address,
        ciudad,
        codigoPostal,
        pais,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        nombres,
        address,
        ciudad,
        codigoPostal,
        pais,
      })
    );
    navigate('/metodoPago');
  };
  return (
    <div>
      <Helmet>
        <title>Dirección de envío</title>
      </Helmet>

      <PasosdePago paso1 paso2></PasosdePago>
      <div className="container small-container">
        <h1 className="my-3">Dirección de envío</h1>

        <Form onSubmit={ButtonControlador}>
          <Form.Group className="mb-3" controlId="nombres">
            <Form.Label>Nombres:</Form.Label>
            <Form.Control
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              value={address} //tiene que ser address porque o sino me genera error y no se porque
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Ciudad:</Form.Label>
            <Form.Control
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Codigo Postal:</Form.Label>
            <Form.Control
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Pais:</Form.Label>
            <Form.Control
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              required
            />
          </Form.Group>

          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
