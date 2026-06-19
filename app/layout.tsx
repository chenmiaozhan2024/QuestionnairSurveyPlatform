// app/layout.tsx — 根布局（所有页面共享）
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '问卷调查系统',
  description: '简单高效的问卷调查管理系统',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
