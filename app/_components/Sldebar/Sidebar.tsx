'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import SvgIcon from '@/components/SvgIcon'
import styles from './Sidebar.module.css'

const navItems = [
  { path: '/', icon: 'wenjuanY', text: '我的问卷' },
  { path: '/recycleBin', icon: 'deleteStation', text: '回收站' },
  { path: '/myFiles', icon: 'wenjianLeft', text: '我的文件' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const toAdd = () => {
    router.push('/add')
  }

  return (
    <div className={styles.SidebarContainer}>
      <div className={styles.leftTitle} onClick={toAdd}>
        新建问卷
      </div>
      <ul className={styles.leftUl}>
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <li key={item.path} className={isActive ? styles.active : ''}>
              <Link
                href={item.path}
                className={`${styles.link} ${isActive ? styles.active : ''}`}
              >
                <SvgIcon name={item.icon} width="22" height="22" />
                <div className={styles.rightWen}>{item.text}</div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
