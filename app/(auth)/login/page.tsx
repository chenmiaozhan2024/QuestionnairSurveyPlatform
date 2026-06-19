'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import LoginForm from './_components/loginForm'
import styles from './login.module.css'

const descList = [
  '简单高效地创建和发布问卷调查',
  '实时收集用户反馈与数据',
  '自动生成可视化统计报表',
]

export default function Login() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % descList.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.container}>
      {/* 左侧：Logo + 标题 + 轮播描述 */}
      <div className={styles.left}>
        <Image src="/images/title.png" alt="logo" width={300} height={101} style={{ marginBottom: 70 }} />

        <div className={styles.leftTop}>
          <div className={styles.title}>问卷管理系统</div>
          <div className={styles.desc}>{descList[activeIndex]}</div>
          <div className={styles.lines}>
            {descList.map((_, index) => (
              <div
                key={index}
                className={`${styles.line} ${index === activeIndex ? styles.active : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 右侧：登录表单 */}
      <div className={styles.right}>
       <div className={styles.spacer} />
        <div className={styles.loginForm}>
           
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
