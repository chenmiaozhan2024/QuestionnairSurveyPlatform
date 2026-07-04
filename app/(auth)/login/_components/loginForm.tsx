'use client'

import { useState } from 'react'
import { Input, message } from 'antd'
import { useRouter } from 'next/navigation'
import styles from './loginForm.module.css'
import SvgIcon from '@/components/SvgIcon'
import { request } from '@/lib/request'
import { useAuthStore } from '@/stores/authStore'
import { reqLogin } from '@/services/user/user'
// import { useAuthStore } from '@/stores/authStore'

export default function LoginForm() {
  const router = useRouter()
  const [loginForm, setLoginForm] = useState({
    username: 'admin',
    password: 'password_admin',
  })
  const [loading, setLoading] = useState(false)
  const userRole = useAuthStore((state) => state.userRole);
  // console.log('userRole',userRole)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }
  const { setAuth } = useAuthStore()

  const handleLogin = async () => {
    if (!loginForm.username?.trim()) {
      message.warning('请输入用户名')
      return
    }
    if (!loginForm.password?.trim()) {
      message.warning('请输入密码')
      return
    }

    setLoading(true)
    try {
      // const data = await request<{ msg: string; userRole: string; token: string }>('/api/user/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: loginForm,
      // })
      const result = await reqLogin(loginForm)
      // console.log(result);
      
        if (result.code !== 1) {
          message.error(result.msg || '登录失败')
          return
        }
        const { accessToken, userRole } = result.data
        // 保存 token
        setAuth({
          accessToken: accessToken,
          userRole,
          username: loginForm.username,
        })
        message.success(result.data.msg || '登录成功')
        router.push('/')
    } catch (error: any) {
      message.error(error.message || '登录失败，请检查账号密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        className={styles.form}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleLogin()
        }}
      >
        <div className="logoWenziTop">
                <SvgIcon name="guanghaiwenjuanguanli" width={"205"} height={"64"}></SvgIcon>
           </div>
        <div className={styles.accountWrapper}>
          <Input
            placeholder="请输入用户名"
            value={loginForm.username}
            onChange={handleInputChange}
            name="username"
            className={styles.loginAccountInput}
          />
        </div>
        <div className={`${styles.passwordWrapper}`}>
          <Input.Password
            placeholder="请输入密码"
            value={loginForm.password}
            onChange={handleInputChange}
            name="password"
            className={styles.loginPasswordInput}
          />
        </div>
        <div className={styles.forgetPassword}>忘记密码？</div>
      </div>

      <div className={styles.button} onClick={handleLogin}>
        {loading ? '登录中...' : '登录'}
      </div>
    </>
  )
}
