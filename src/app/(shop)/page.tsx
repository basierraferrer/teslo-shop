export const revalidate = 60; // 60 segundos

import {redirect} from 'next/navigation';

import {getPaginatedProductsWithImages} from '@/actions';
import {Pagination, ProductGrid, Title} from '@/components';

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Home({searchParams}: Props) {
  const {page: pageParam} = await searchParams;
  const page = pageParam ? parseInt(pageParam) : 1;

  const {products, totalPages} = await getPaginatedProductsWithImages({page});

  if (products.length === 0) {
    redirect('/');
  }

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
