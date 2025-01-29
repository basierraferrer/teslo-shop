import Image from 'next/image'
import React from 'react'

interface Props {
  src?: string,
  alt: string,
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'],
  width: number;
  height: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}

export const ProductImage = ({ src, alt, className, width, height, ...rest }: Props) => {

  const localeSrc = (src)
    ? src.startsWith('http') // https://urlcompletodelaimagen.jpg
      ? src : `/products/${src}`
    : '/imgs/placeholder.jpg';

  return (
    <Image
      src={localeSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      {...rest}
    />
  )
}
