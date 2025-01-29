import { currencyFormat } from '@/utils';
import React from 'react'

interface Props {
  itemsCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export const Resume = ({ itemsCount, subtotal, tax, total }: Props) => {
  return (
    <>
      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsCount === 1 ? '1 artículo' : `${itemsCount} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subtotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
      </div>
    </>
  )
}
