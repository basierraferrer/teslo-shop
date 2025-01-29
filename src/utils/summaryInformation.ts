import {CartProduct} from '@/interfaces';

export const getSummaryInformation = (cart: CartProduct[]) => {
  const subTotal = cart.reduce(
    (subTotal, product) => product.quantity * product.price + subTotal,
    0,
  );
  const tax = subTotal * 0.15;
  const total = subTotal + tax;
  const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
  return {
    subTotal,
    tax,
    total,
    itemsInCart,
  };
};
