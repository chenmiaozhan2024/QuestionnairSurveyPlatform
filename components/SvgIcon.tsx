'use client'

import { useEffect, useRef, useState } from 'react'

const svgCache = new Map<string, string>()

interface Props {
  name: string
  size?: string
  width?: string
  height?: string
  color?: string
  profix?: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  style?: React.CSSProperties
}

export default function SvgIcon({
  name,
  size,
  width,
  height,
  color,
  className,
  onClick,
  style,
}: Props) {
  const ensurePx = (val: string) => /^\d+$/.test(val) ? `${val}px` : val
  const finalWidth = width ? ensurePx(width): (size?ensurePx(size):'36px')
  const finalHeight = height ? ensurePx(height): (size?ensurePx(size):'36px')
  const [svgContent, setSvgContent] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cached = svgCache.get(name)
    if (cached) {
      setSvgContent(color 
        ? cached.replace(/fill="[^"]*"/g, `fill="${color}"`) 
        : cached
      )
      return
    }
    fetch(`/svg/${name}.svg`)
      .then((res) => res.text())
      .then((svgText) => {
        svgCache.set(name, svgText)
        let modified = svgText
        if (color) {
          modified = modified.replace(/fill="[^"]*"/g, `fill="${color}"`)
        }
        setSvgContent(modified)
      })
  }, [name, color])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'inline-flex',
        width: finalWidth,
        height: finalHeight,
        ...style,
      }}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
