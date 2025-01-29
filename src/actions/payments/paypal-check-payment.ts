'use server';

import {PaypalOrderStatusResponse, StatusOrder} from '@/interfaces';
import prisma from '@/lib/prisma';
import {revalidatePath} from 'next/cache';

export const getPayPalAuthToken = async (): Promise<string | null> => {
  const {NEXT_PAYPAL_PUBLIC_ID, PAYPAL_SECRET, PAYPAL_OAUTH_URL} = process.env;
  const oauthUrl = PAYPAL_OAUTH_URL ?? '';
  const b64Token = Buffer.from(
    `${NEXT_PAYPAL_PUBLIC_ID}:${PAYPAL_SECRET}`,
    'utf-8',
  ).toString('base64');

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  myHeaders.append('Authorization', `Basic ${b64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');

  try {
    const result = await fetch(oauthUrl, {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
    }).then(r => r.json());
    return result.access_token;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

const validatePayPalResponse = async (
  paypalTransactionId: string,
  bearerToken: string,
): Promise<PaypalOrderStatusResponse | null> => {
  const {PAYPAL_ORDERS_URL} = process.env;
  const ordersUrl = `${PAYPAL_ORDERS_URL}/${paypalTransactionId}`;
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${bearerToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  try {
    const result = await fetch(ordersUrl, requestOptions).then(r => r.json());
    return result;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

const getOrderStatus = (statusResponse: string): StatusOrder => {
  let status = StatusOrder.PENDING;

  switch (statusResponse) {
    case 'COMPLETED':
      status = StatusOrder.PAID;
      break;
    default:
      break;
  }

  return status;
};

export const paypalCheckPayment = async (transactionId: string) => {
  try {
    const authPaypalToken = await getPayPalAuthToken();
    if (!authPaypalToken) {
      return {
        ok: false,
        message: 'No se pudo obtener token de verificación',
      };
    }

    const response = await validatePayPalResponse(
      transactionId,
      authPaypalToken,
    );

    if (!response) {
      return {
        ok: false,
        message: 'Error al verificar el pago',
      };
    }

    const {status, purchase_units} = response;
    const {invoice_id} = purchase_units[0];
    if (status !== 'COMPLETED') {
      return {
        ok: false,
        message: 'Aun no se ha pagado en Paypal',
      };
    }

    const order = await prisma.order.update({
      where: {
        id: invoice_id,
      },
      data: {
        status: getOrderStatus(status),
        paidAt: new Date(),
      },
    });

    if (!order) {
      return {
        ok: false,
        message: `La orden ${invoice_id} no se encuentra - 404`,
      };
    }

    revalidatePath(`/orders/${invoice_id}`);
    return {
      ok: true,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      ok: false,
      message: 'Fallo proceso de verificación de pago',
    };
  }
};
