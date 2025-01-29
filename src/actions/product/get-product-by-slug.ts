'use server';

import prisma from '@/lib/prisma';

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      include: {
        ProductImage: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      where: {
        slug: slug,
      },
    });

    if (!product) return null;

    return {
      ...product,
      images: product.ProductImage.map(image => image.url),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Error al obtener producto por slug');
  }
};
