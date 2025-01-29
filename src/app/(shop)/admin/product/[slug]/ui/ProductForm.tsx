"use client";

import { createUpdateProduct } from "@/actions";
import { ProductImage } from "@/components";
import { deleteImage } from "@/actions";
import { Categories, Gender, Product, ProductImage as IProductImage } from "@/interfaces";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface Props {
  product: Partial<Product> & { ProductImage?: IProductImage[] };
  categories?: Categories[] | null;
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: Gender;
  categoryId: string;
  // todo:Images
  images?: FileList
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(', '),
      sizes: product.sizes ?? [],
      // TODO: images
      images: undefined
    }
  });
  watch('sizes');

  const onSubmit = async (data: FormInputs) => {
    const { images, ...productToSave } = data;
    const formData = new FormData();

    if (product.id) {
      formData.append('id', product.id ?? '');
    }

    formData.append('title', productToSave.title ?? '');
    formData.append('slug', productToSave.slug ?? '');
    formData.append('description', productToSave.description ?? '');
    formData.append('price', productToSave.price.toString());
    formData.append('inStock', productToSave.inStock.toString());
    formData.append('sizes', productToSave.sizes.toString());
    formData.append('tags', productToSave.tags);
    formData.append('categoryId', productToSave.categoryId);
    formData.append('gender', productToSave.gender);

    if (images) {
      for (let index = 0; index < images.length; index++) {
        formData.append('images', images[index]);
      }
    }

    const { ok, product: productData } = await createUpdateProduct(formData);
    if (!ok) {
      alert('No se pudo actualizar');
    }

    router.replace(`/admin/product/${productData?.slug}`)

  }
  const onSizeChanged = (size: string) => {
    const sizes = new Set(getValues('sizes'));
    if (!sizes.has(size)) {
      sizes.add(size);
    } else {
      sizes.delete(size);
    }
    setValue('sizes', [...sizes]);
  }

  const [isDeletingImage, setIsDeletingImage] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input type="text" {...register('title', { required: true })} className="p-2 border rounded-md bg-gray-200" />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input type="text" {...register('slug', { required: true })} className="p-2 border rounded-md bg-gray-200" />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register('description', { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input type="number" {...register('price', { required: true, min: 0 })} className="p-2 border rounded-md bg-gray-200" />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input type="text" {...register('tags', { required: true })} className="p-2 border rounded-md bg-gray-200" />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('gender', { required: true })}>
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('categoryId', { required: true })}>
            <option value="">[Seleccione]</option>
            {categories?.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
          </select>
        </div>

        <button className={clsx("w-full mt-4", {
          'btn-primary': isValid,
          'btn-disabled': !isValid,
        })} disabled={!isValid || isDeletingImage}>
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input type="number" {...register('inStock', { required: true, min: 0 })} className="p-2 border rounded-md bg-gray-200" />
        </div>
        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {
              sizes.map(size => (
                // bg-blue-500 text-white <--- si está seleccionado
                <button
                  key={size}
                  className={
                    clsx("p-2 border rounded-md mr-2 mb-2 w-14 transition-all text-center", {
                      'bg-blue-500 text-white': getValues('sizes').includes(size),
                    })
                  }
                  onClick={() => onSizeChanged(size)}
                  type="button"
                >
                  <span>{size}</span>
                </button>
              ))
            }

          </div>

          {/* Photos */}
          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              type="file"
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif"
              {...(register('images'))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <ProductImage
                  alt={product?.title ?? ''}
                  src={image.url}
                  width={300}
                  height={300}
                  className="rounded-t-xl shadow-md"
                />
                <button
                  onClick={async () => {
                    setIsDeletingImage(true);
                    await deleteImage(Number(image.id), image.url);
                    setIsDeletingImage(false);
                  }}
                  className="btn-danger w-full text-sm rounded-b-xl"
                  type="button"
                >Eliminar</button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </form>
  );
};
