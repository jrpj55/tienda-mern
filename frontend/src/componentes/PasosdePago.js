import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function PasosdePago(props) {
  return (
    <Row className="checkout-steps">
      <Col className={props.paso1 ? 'active' : ''}>Iniciar sesión</Col>
      <Col className={props.paso2 ? 'active' : ''}>Dirección de envío</Col>
      <Col className={props.paso3 ? 'active' : ''}>Orden de pago</Col>
      <Col className={props.paso4 ? 'active' : ''}>Realizar pedido</Col>
    </Row>
  );
}

export default PasosdePago;
