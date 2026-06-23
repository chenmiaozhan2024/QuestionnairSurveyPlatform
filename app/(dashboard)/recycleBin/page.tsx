'use client'

import Questionnaire from '../myQuestionnair/_components/Questionnaire'
import styles from './page.module.css'

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.left}>回收站</div>
        <div className={styles.right}>
          {/*<Input></Input>*/}
        </div>
      </div>
      <div className={styles.bottom}>
        <Questionnaire choice="2" type="recycle" />
      </div>
    </div>
  )
}
