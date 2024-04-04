import Alert from 'react-bootstrap/Alert';

export default function BuzonDeMensaje(props) {
  return <Alert variant={props.variant || 'info'}>{props.children}</Alert>;
}
