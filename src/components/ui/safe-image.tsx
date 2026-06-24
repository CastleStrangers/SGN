"use client"
import { useState } from "react"

interface Props {
  src: string
  alt: string
  fallbackSrc: string
  className?: string
}

export default function SafeImage({ src, alt, fallbackSrc, className }: Props) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setImgSrc(fallbackSrc)}
      className={className}
    />
  )
}
