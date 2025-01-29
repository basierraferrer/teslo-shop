'use server';
import {auth} from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrderById = async (orderId: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: 'Debe estar autenticado',
    };
  }
  try {
    const order = await prisma.order.findUnique({
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            quantity: true,
            price: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new Error(`No se encontró orden # ${orderId} - 404`);
    }

    if (session.user.role === 'user') {
      if (session.user.id !== order.userId) {
        throw new Error(`La orden # ${orderId} no es de ese usuario - 400`);
      }
    }

    return {
      ok: true,
      data: order,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      ok: false,
      message: `No se encontró orden # ${orderId} - 404`,
      data: null,
    };
  }
};
