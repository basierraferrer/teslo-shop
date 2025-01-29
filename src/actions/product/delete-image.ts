/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import {cloudinary} from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import {revalidatePath} from 'next/cache';

export const deleteImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith('http')) {
    return {
      ok: false,
      error: 'No se pueden borrar imagenes de FS',
    };
  }
  try {
    const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';
    try {
      await cloudinary.uploader.destroy(imageName);
      const deletedImage = await prisma.productImage.delete({
        where: {
          id: imageId,
        },
        select: {
          product: {
            select: {
              slug: true,
            },
          },
        },
      });
      revalidatePath(`/admin/product/${deletedImage.product.slug}`);
    } catch (error) {
      return {
        ok: false,
        mesaage: 'Ocurrio un error al intentar eliminar una imagen',
      };
    }
  } catch (error) {
    return {
      ok: false,
      mesaage: 'Ocurrio un error al intentar eliminar una imagen',
    };
  }
};
