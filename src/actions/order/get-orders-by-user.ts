'use server';
import {auth} from '@/auth.config';
import prisma from '@/lib/prisma';

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getOrdersByUser = async ({
  page = 1,
  take = 12,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  const session = await auth();
  let options = {};

  if (!session?.user) {
    return {
      ok: false,
      message: 'Debe estar autenticado - 500',
    };
  }

  if (session.user.role === 'user') {
    options = {
      where: {
        userId: session.user.id,
      },
    };
  }

  try {
    const orders = await prisma.order.findMany({
      ...options,
      orderBy: {
        createdAt: 'desc',
      },
      take: take,
      skip: (page - 1) * take,
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const totalCount = await prisma.order.count({
      ...options,
    });

    const totalPages = Math.ceil(totalCount / take);

    return {
      ok: true,
      currentPage: page,
      orders,
      totalPages,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      ok: false,
      message: 'Error al intentar obtener las ordenes',
    };
  }
};
