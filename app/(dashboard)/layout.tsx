// app/(dashboard)/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../_components/Sldebar/Sidebar'
import Topbar from '../_components/Topbar/Topbar'
import {useAuthStore} from '@/stores/authStore'
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const token = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!token) {
      console.log('执行了跳转登录');
      
      router.push('/login')
      return
    }
    setReady(true)
  }, [token, router])

  if (!ready) {
    return null
  }

  return (
    <div>
      <Topbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24, backgroundColor: '#F4F4F4' }}>{children}</main>
      </div>
    </div>
  )
}