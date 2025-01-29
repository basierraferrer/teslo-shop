/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import {cloudinary} from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import {Gender, Product, Size} from '@prisma/client';
import {revalidatePath} from 'next/cache';
import {z} from 'zod';

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform(val => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform(val => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform(val => val.split(',')),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);
  if (!productParsed.success) {
    return {ok: false, message: productParsed.error.message};
  }

  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim();

  const {id, ...rest} = product;

  try {
    const prismaTx = await prisma.$transaction(async tx => {
      let product: Product;

      const tagsArray = rest.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase());

      if (id) {
        // actualizar
        product = await tx.product.update({
          where: {
            id,
          },
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[],
            },
            gender: {
              set: rest.gender as Gender,
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      } else {
        // create
        product = await tx.product.create({
          data: {
            ...rest,
            sizes: rest.sizes as Size[],
            gender: rest.gender as Gender,
            tags: tagsArray,
          },
        });
      }

      if (formData.getAll('images')) {
        const images = await uploadImages(formData.getAll('images') as File[]);
        if (!images)
          throw new Error('No se pudo cargar las imagenes, rollback');

        await tx.productImage.createMany({
          data: images.map(img => ({
            url: img as string,
            productId: product.id,
          })),
        });
      }

      return {product};
    });

    // TODO: revalidatePath
    revalidatePath(`/admin/products`);
    revalidatePath(`/admin/product/${prismaTx.product.slug}`);
    revalidatePath(`/product/${prismaTx.product.slug}`);

    return {
      ok: true,
      product: prismaTx.product,
    };
  } catch (error) {
    return {
      ok: false,
    };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async image => {
      try {
        const buffer = await image.arrayBuffer();
        const b64Img = Buffer.from(buffer).toString('base64');

        return cloudinary.uploader
          .upload(`data:image/png;base64,${b64Img}`)
          .then(r => r.secure_url);
      } catch (error) {
        console.log('**__** ~ uploadPromises ~ error:', error);
        return null;
      }
    });
    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.log('**__** ~ uploadImages ~ error:', error);
    return null;
  }
};
