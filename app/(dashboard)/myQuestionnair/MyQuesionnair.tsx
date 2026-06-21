'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SvgIcon from '@/components/SvgIcon'
import Questionnaire from './_components/Questionnaire'
import styles from './MyQuesionnair.module.css'

export default function MyQuestionnair() {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState('')

  const handleAddQuestionnaire = () => {
    router.push('/add')
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.left}>个人问卷</div>
        <div className={styles.right}></div>
      </div>

      <div className={styles.center}>
        <div className={styles.tabs}>
          <ul>
            <li
              onClick={() => setCurrentTab('')}
              className={currentTab === '' ? styles.active : ''}
            >
              所有问卷
            </li>
            <li
              onClick={() => setCurrentTab('1')}
              className={currentTab === '1' ? styles.active : ''}
            >
              已结束问卷
            </li>
            <li
              onClick={() => setCurrentTab('0')}
              className={currentTab === '0' ? styles.active : ''}
            >
              待收集问卷
            </li>
          </ul>
        </div>

        <div className={styles.addBtn} onClick={handleAddQuestionnaire}>
          <SvgIcon name="tainjiawenjuan" width="24" height="24" />
          <div className={styles.addText}>添加问卷</div>
        </div>
      </div>

      <div className={styles.bottom}>
        <Questionnaire choice={currentTab} />
      </div>
    </div>
  )
}
