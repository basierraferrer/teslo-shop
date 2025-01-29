'use server';

import prisma from '@/lib/prisma';

export const deleteUserAddress = async (userId: string) => {
  try {
    const userAddress = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });

    if (userAddress) {
      await prisma.userAddress.delete({
        where: {
          userId,
        },
      });
    }

    return {
      ok: true,
      message: '',
      data: userAddress,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      ok: false,
      message: 'Error while deleting user address',
    };
  }
};
