'use client';
import { useAddressStore, useCartStore } from '@/store';
import React, { useEffect, useState } from 'react';
import { PlaceOrderSkeleton } from './PlaceOrderSkeleton';
import { getSummaryInformation, sanitizeAddressORder } from '@/utils';
import clsx from 'clsx';
import { placeOrder } from '@/actions';
import { useRouter } from 'next/navigation';
import { IoInformationCircle } from 'react-icons/io5';
import { AddressDelivery, Resume } from '@/components';

export const PlaceOrder = () => {
	const [loaded, setLoaded] = useState(false);
	const [isOrdering, setIsOrdering] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>();

	const address = useAddressStore(state => state.address);
	const cart = useCartStore(state => state.cart);
	const clearCart = useCartStore(state => state.clearCart);
	const { itemsInCart, subTotal, tax, total } = getSummaryInformation(cart);
	const router = useRouter();

	useEffect(() => {
		setLoaded(true);
	}, []);

	const onPlaceOrder = async () => {
		setIsOrdering(true);
		const productsToOrder = cart.map(({ id, quantity, size }) => ({
			productId: id,
			quantity,
			size
		}))

		const addressOrder = sanitizeAddressORder(address);
		const response = await placeOrder(productsToOrder, addressOrder);

		if (!response.ok) {
			setIsOrdering(false);
			setErrorMessage(response.message);
			return;
		}

		clearCart();
		router.replace(`/orders/${response.order?.id}`);
	}

	if (!loaded || isOrdering) {
		return <PlaceOrderSkeleton />
	}

	return (
		<div className="bg-white rounded-xl shadow-xl p-7">
			<AddressDelivery address={address} />

			{/* Divider */}
			<div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

			<Resume itemsCount={itemsInCart} subtotal={subTotal} tax={tax} total={total} />

			<div className="mt-5 mb-2 w-full">
				<p className="mb-5">
					{/* Disclaimer */}
					<span className="text-xs">
						Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros{' '}
						<a href="#" className="underline">
							términos y condiciones
						</a>{' '}
						y{' '}
						<a href="#" className="underline">
							política de privacidad
						</a>
					</span>
				</p>

				{errorMessage && (<div className="m-4 flex flex-row justify-center">
					<IoInformationCircle className="h-5 w-5 text-red-500" />
					<p className="text-sm text-red-500 mr-4">{errorMessage}</p>
				</div>)}


				<button
					className={clsx({
						'btn-primary': !isOrdering,
						'btn-disabled': isOrdering,
					})}
					onClick={onPlaceOrder}
					disabled={isOrdering}
				//href="/orders/123"
				>
					Colocar orden
				</button>
			</div>
		</div>
	);
};
