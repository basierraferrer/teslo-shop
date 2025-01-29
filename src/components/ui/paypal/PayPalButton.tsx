'use client';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { CreateOrderData, CreateOrderActions, OnApproveActions, OnApproveData } from '@paypal/paypal-js'
import React from 'react'
import { paypalCheckPayment, setTransactionId } from '@/actions';


interface Props {
  orderId: string;
  amount: number;
}

export const PayPalButton = ({ amount, orderId }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return <div className='animate-pulse mb-12'>
      <div className='h-11 bg-gray-300 rounded my-2' />
      <div className='h-11 bg-gray-300 rounded my-2' />
    </div>
  }

  const roundedAmount = Math.round(amount * 100) / 100;

  const createOrder = async (_data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            currency_code: 'USD',
            value: `${roundedAmount}`,
          }
        }
      ]
    });

    if (transactionId) {
      const response = await setTransactionId(orderId, transactionId);

      if (!response.ok) {
        throw new Error(response?.message)
      }
    }


    return transactionId
  };


  const onApprove = async (_data: OnApproveData, actions: OnApproveActions) => {
    try {
      const details = await actions.order?.capture();

      if (!details) return;
      const response = await paypalCheckPayment(details.id ?? '');

      if (!response?.ok) {
        throw new Error(response?.message)
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log("**__** ~ onApprove ~ error:", error);
    }
  }

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
    />
  )
}
