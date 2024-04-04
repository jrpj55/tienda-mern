import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function CajaDeCarga() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Leyendo..</span>
    </Spinner>
  );
}
