// app/(dashboard)/layout.tsx — 后台布局（工作台页面共享）
import Sidebar from '../_components/Sldebar/Sidebar'
import Topbar from '../_components/Topbar/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Topbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24,backgroundColor:'#F4F4F4' }}>{children}</main>
      </div>
    </div>
  )
}
