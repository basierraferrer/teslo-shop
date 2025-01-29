// https://tailwindcomponents.com/component/hoverable-table
export const revalidate = 0;

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, Title } from '@/components';
import { redirect } from 'next/navigation';
import { ProductsTable } from './ui/ProductsTable';
import Link from 'next/link';

interface Props {
  searchParams: Promise<{
    page: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {

  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({ page });

  if (products.length === 0) {
    redirect('/');
  }

  return (
    <div className='flex flex-col'>
      <Title title="Mantenimiento de productos" className="mb-2" />

      <Link href='/admin/product/new' className='btn-primary mb-2 self-end w-[200px] text-center'>
        Agregar producto
      </Link>

      <ProductsTable products={products} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
