import { StatusOrder } from '@/interfaces'
import clsx from 'clsx'
import React from 'react'
import { IoCardOutline } from 'react-icons/io5'

interface Props {
  status?: StatusOrder
  withBackground?: boolean
}

export const Status = ({ status, withBackground = false }: Props) => {

  return (
    <div
      className={clsx(
        'flex items-center rounded-lg py-2 px-3.5 text-xs',
        {
          'text-white': withBackground,
          'font-bold': withBackground,
          'font-semibold': !withBackground,
          'bg-yellow-500': status === StatusOrder.PENDING && withBackground,
          'bg-red-500': status === StatusOrder.REJECTED && withBackground,
          'bg-green-700': status === StatusOrder.PAID && withBackground,
          'text-yellow-500': status === StatusOrder.PENDING && !withBackground,
          'text-red-500': status === StatusOrder.REJECTED && !withBackground,
          'text-green-700': status === StatusOrder.PAID && !withBackground,
        },
      )}>
      <IoCardOutline size={30} />
      <span className="mx-2">{status?.toUpperCase()}</span>
    </div>
  )
}
