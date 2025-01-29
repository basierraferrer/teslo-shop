// https://tailwindcomponents.com/component/hoverable-table
export const revalidate = 0;

import { getOrdersByUser } from '@/actions';
import { OrdersTable, Pagination, Title } from '@/components';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{
    page: string
  }>
}

export default async function OrdersPage({ searchParams }: Props) {

  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam) : 1;


  const { orders, totalPages, ok } = await getOrdersByUser({ page });

  if (!ok) {
    redirect('/')
  }


  return (
    <>
      <Title title="Orders" />

      <div className="mb-10">
        {
          !orders || !orders.length ? (
            <div className='min-w-full bg-gray-200 border-b p-3'>Sin ordenes</div>
          ) :
            (
              <>
                <OrdersTable orders={orders} />
                <Pagination totalPages={totalPages} />
              </>
            )
        }
      </div>
    </>
  );
}
