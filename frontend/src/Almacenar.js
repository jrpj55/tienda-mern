import { createContext, useReducer } from 'react';

//Crear una tienda de almacenamiento
export const Almacenar = createContext();
//definimos el estado inicial

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  //inicialmente el carrito carga vacio porque no han seleccionado ningun articulo
  //pero despues utilizamos el almacenamiento local para que al refrecar la pagina no desaparezca del carrito
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};
//definimnos la función reductora
function reducer(state, action) {
  switch (action.type) {
    case 'AGREGAR_CARRITO_ARTICULO':
      //Adicionar al carrito
      //linea de codigo para no agregar productos multiples
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'ELIMINAR_ITEM_CARRITO': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'INICIAR_SESION_USUARIO':
      //action.payload significa carga util de acción
      return { ...state, userInfo: action.payload };
    case 'CERRAR_SESION_USUARIO':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    case 'GUARDAR_DIRECCION_ENVIO':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'GUARDAR_METODO_PAGO':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case 'BORRAR_CARRITO':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const values = { state, dispatch };
  return (
    <Almacenar.Provider value={values}>{props.children}</Almacenar.Provider>
  );
}
