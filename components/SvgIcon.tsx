'use client'

import { useEffect, useRef, useState } from 'react'

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
  const finalWidth = width ?? size ?? '36px'
  const finalHeight = height ?? size ?? '36px'
  const [svgContent, setSvgContent] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/svg/${name}.svg`)
      .then((res) => res.text())
      .then((svgText) => {
        // 注入 color
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
