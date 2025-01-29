'use server';

import {auth} from '@/auth.config';
import prisma from '@/lib/prisma';

export const setTransactionId = async (
  orderId: string,
  transactionId: string,
) => {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error('No está autenticado');
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId,
      },
    });

    if (!order) {
      return {
        ok: false,
        message: `No se encontró la order ${orderId} - 404`,
      };
    }

    return {
      ok: true,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      ok: false,
      message: `No se pudo actualizar la order ${orderId} - ${(error as Error)?.message ?? ''}`,
    };
  }
};
