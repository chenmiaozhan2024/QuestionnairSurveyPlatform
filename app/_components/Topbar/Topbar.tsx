'use client'

import { useRouter } from 'next/navigation'
import SvgIcon from '@/components/SvgIcon'
import styles from './Topbar.module.css'

export default function Topbar() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className={styles.TopbarContainer}>
      <div className={styles.NavLeft}>
        <SvgIcon name="LOGOSmall" width="196" height="56" />
        <span className={styles.wenzi}>问卷调查系统</span>
      </div>
      <div className={styles.NavRight}>
        <div className={styles.layout} onClick={handleLogout}>退出登录</div>
        <div className={styles.avatar}>软</div>
      </div>
    </div>
  )
}
