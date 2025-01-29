import { Product } from '@/interfaces'
import React from 'react'
import Link from 'next/link';
import { currencyFormat } from '@/utils';
import { ProductImage } from '@/components';

interface Props {
  products: Product[]
}

export const ProductsTable = ({ products }: Props) => {
  return (
    <table className="min-w-full border mt-4">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Imagen
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Titulo
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Precio
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Genero
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Stock
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Tallas
          </th>
        </tr>
      </thead>
      <tbody>
        {
          products.map(product => (
            <tr key={product.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Link href={`/product/${product.slug}`}>
                  <ProductImage
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full object-cover rounded"
                    width={80}
                    height={80}
                  />
                </Link>
              </td>
              <td className="text-sm text-gray-900 font-light px-6">
                <Link
                  href={`/admin/product/${product.slug}`}
                  className='hover:underline'
                >
                  {product.title}
                </Link>
              </td>
              <td className="text-sm text-gray-900 font-bold px-6">
                {currencyFormat(product.price)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 ">
                {product.gender}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 ">
                {product.inStock}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 ">
                {product.sizes.join(', ')}
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}
