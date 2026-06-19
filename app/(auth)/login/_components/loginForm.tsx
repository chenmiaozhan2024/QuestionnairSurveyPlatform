'use client'

import { useState } from 'react'
import { Input, message } from 'antd'
import { useRouter } from 'next/navigation'
import styles from '../login.module.css'
import SvgIcon from '@/components/SvgIcon'
import { ApiResponse, request } from '@/lib/request'

export default function LoginForm() {
  const router = useRouter()
  const [loginForm, setLoginForm] = useState({
    username: 'admin',
    password: 'password_admin',
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

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
      const data = await request<{ msg: string; userRole: string; token: string }>('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: loginForm,
      })

      // 保存 token
      localStorage.setItem('token', data.token)
      message.success(data.msg || '登录成功')
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
            className="login-account-input"
          />
        </div>
        <div className={`login-password-wrapper ${styles.passwordWrapper}`}>
          <Input.Password
            placeholder="请输入密码"
            value={loginForm.password}
            onChange={handleInputChange}
            name="password"
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
