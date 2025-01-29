'use server';

import prisma from '@/lib/prisma';

export const getCountries = async () => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return countries;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
};
