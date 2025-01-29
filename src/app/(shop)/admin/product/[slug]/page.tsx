export const revalidate = 604800; //7 días
import { Metadata } from 'next';

import { redirect } from 'next/navigation';
import {
  Title,
} from '@/components';
import { getCategories, getProductBySlug } from '@/actions';
import { ProductForm } from './ui/ProductForm';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  // read route params
  const { slug } = await params;

  // fetch data
  const product = await getProductBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      // images: [], // https://misitioweb.com/products/image.png
      images: [`/products/${product?.images[1]}`],
    },
  };
}

export default async function ProductBySlugPage({ params }: Props) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategories()
  ]);

  if (!product && slug !== 'new') {
    redirect('/admin/products')
  }

  const title = slug === 'new' ? 'Nuevo producto' : 'Editar producto';

  return (
    <>
      <Title title={title} />
      <ProductForm product={product ?? {}} categories={categories} />
    </>
  );
}
