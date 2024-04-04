import React, { useContext, useReducer, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import BuzonDeMensaje from '../componentes/BuzonDeMensaje';
import CajaDeCarga from '../componentes/CajaDeCarga';
import { utilsError } from '../utilsError';
import Button from 'react-bootstrap/Button';
import { Almacenar } from '../Almacenar';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function PantallaOderHistorial() {
  const { state } = useContext(Almacenar);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/pedidos/mios`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: utilsError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <Helmet>
        <title>Historial de ordenes</title>
      </Helmet>
      <h1>Historial de ordenes</h1>
      {loading ? (
        <CajaDeCarga></CajaDeCarga>
      ) : error ? (
        <BuzonDeMensaje variant="danger">{error}</BuzonDeMensaje>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrecio.toFixed(2)}</td>
                <td>{order.pagado ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.entregado
                    ? order.fecha_entrega.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
