import { Address } from '@/interfaces'
import React from 'react'

interface Props {
  address: Address
}

export const AddressDelivery = ({ address }: Props) => {
  return (
    <>
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">{address.firstName} {address.lastName}</p>
        <p className="text-sm mt-2">Dirección: {address.address}, {address?.address2 ?? ''}</p>
        <p className="text-sm mt-2">{address.city}, {address.country}</p>
        <p className="text-sm mt-2">Código postal: {address.postalCode}</p>
        <p className="text-sm mt-2">Telefono: {address.phone}</p>
      </div>
    </>
  )
}
