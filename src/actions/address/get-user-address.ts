import prisma from '@/lib/prisma';

export const getUserAddress = async (userId: string) => {
  try {
    const userAddress = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });

    if (!userAddress) {
      return null;
    }

    const {countryId, address2, ...rest} = userAddress;

    return {
      ...rest,
      country: countryId,
      address2: address2 || '',
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return undefined;
  }
};
