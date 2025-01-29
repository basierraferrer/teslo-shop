/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOrderById } from '@/actions';
import { AddressDelivery, Items, PayPalButton, Resume, Status, Title } from '@/components';

import { redirect } from 'next/navigation';

import { getSummaryInformation } from '@/utils';
import { StatusOrder } from '@/interfaces';




interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrdersByIdPage({ params }: Props) {
  const { id } = await params;

  //TODO: call server action
  const { ok, data: order } = await getOrderById(id);

  // Todo: verificar
  if (!ok) {
    redirect('/')
  }

  const { itemsInCart, subTotal, tax, total } = getSummaryInformation((order?.OrderItem as any) ?? [])

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split('-').at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <Status status={order?.status as StatusOrder} withBackground />

            {/* Items */}
            <Items products={order?.OrderItem.map(oItem => ({
              id: '',
              slug: oItem.product.slug,
              title: oItem.product.title,
              price: oItem.price,
              quantity: oItem.quantity,
              size: oItem.size,
              image: oItem.product.ProductImage[0].url,
            }))} />
          </div>

          {/* Checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <AddressDelivery address={{
              firstName: order?.OrderAddress?.firstName ?? '',
              lastName: order?.OrderAddress?.lastName ?? '',
              city: order?.OrderAddress?.city ?? '',
              country: order?.OrderAddress?.countryId ?? '',
              address: order?.OrderAddress?.address ?? '',
              address2: order?.OrderAddress?.address2 ?? '',
              phone: order?.OrderAddress?.phone ?? '',
              postalCode: order?.OrderAddress?.postalCode ?? '',
            }} />

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <Resume itemsCount={itemsInCart} subtotal={subTotal} tax={tax} total={total} />

            <div className="mt-5 mb-2 w-full">
              {
                order?.status === StatusOrder.PENDING ?
                  <PayPalButton amount={total} orderId={order!.id} />
                  :
                  <Status status={order?.status as StatusOrder} withBackground />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
