'use server';
import {auth} from '@/auth.config';
import type {Address, Size} from '@/interfaces';
import prisma from '@/lib/prisma';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productsToOrder: ProductToOrder[],
  address: Address,
) => {
  const session = await auth();
  const userId = session?.user.id;
  // validating user session
  if (!userId) {
    return {
      ok: false,
      message: 'Theres no user session',
    };
  }

  // get product info
  // Note: Recordar que podemos llevar 2+ articulos con el mismo id
  const productsStored = await prisma.product.findMany({
    where: {
      id: {
        in: productsToOrder.map(({productId}) => productId),
      },
    },
  });

  // calcular montos
  const itemsInOrder = productsToOrder.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  // calcular valores de tax, subtotal y total
  const {total, tax, subtotal} = productsToOrder.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = productsStored.find(
        itemStored => itemStored.id === item.productId,
      );

      if (!product) {
        throw new Error(`${item.productId} not found - 500`);
      }

      const subtotal = product.price * productQuantity;

      totals.subtotal += subtotal;
      totals.tax += subtotal * 0.15;
      totals.total += subtotal * 1.15;

      return totals;
    },
    {
      total: 0,
      tax: 0,
      subtotal: 0,
    },
  );

  const {country, address2 = '', ...restAddress} = address;

  try {
    const prismaTx = await prisma.$transaction(async tx => {
      // 1. Actualizar el stock de los productos
      const updatedProductPromises = productsStored.map(ps => {
        const productQuantity = productsToOrder
          .filter(po => po.productId === ps.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${ps.id} no tiene cantidad definida`);
        }
        return tx.product.update({
          where: {id: ps.id},
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductPromises);

      updatedProducts.forEach(up => {
        if (up.inStock < 0) {
          throw new Error(`${up.title} no tiene inventario suficiente`);
        }
      });

      // 2. Crear el encabezado, orden y detalle
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subtotal,
          tax,
          total,

          OrderItem: {
            createMany: {
              data: productsToOrder.map(product => ({
                quantity: product.quantity,
                size: product.size,
                productId: product.productId,
                price:
                  productsStored.find(ps => ps.id === product.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });

      // 3. Crear la dirección de la orden
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          address2,
          countryId: country,
          orderId: order.id,
        },
      });

      // return data
      return {
        order,
        orderAddress,
        updatedProducts,
      };
    });
    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (error) {
    return {
      ok: false,
      message: (error as Error)?.message,
    };
  }
};
