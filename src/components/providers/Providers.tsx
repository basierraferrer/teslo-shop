'use client';

import { SessionProvider } from 'next-auth/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

interface Props {
  children: React.ReactNode;
  clientId: string;
}

export const Providers = ({ children, clientId }: Props) => {
  return <PayPalScriptProvider options={{
    clientId,
    intent: 'capture',
    currency: 'USD'
  }}>
    <SessionProvider>{children}</SessionProvider>
  </PayPalScriptProvider>;
};
