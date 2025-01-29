'use client';
import { useEffect, useState } from 'react';

import { useCartStore } from '@/store';
import { ProductsInCartSkeleton } from './ProductsInCartSkeleton';
import { Items } from '@/components';

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore(state => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <ProductsInCartSkeleton />;
  }

  return (
    <Items products={productsInCart} />
  );
};
