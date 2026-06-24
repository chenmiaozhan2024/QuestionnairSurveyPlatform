'use client'

import styles from './page.module.css'
import TopBar from '../_components/Topbar/Topbar'
import SvgIcon from '@/components/SvgIcon'
import { useRouter } from 'next/navigation'
import QuestionTypePanel from './_components/QuestionTypePanel/QuestionTypePanel'
import QuestionPropertyPanel from './_components/QuestionPropertyPanel/QuestionPropertyPanel'
import CenterArea from './_components/CenterArea/CenterArea'

export default function Page() {
   const router = useRouter()
   const goBack=()=>{
      router.push('/')
    }
  return <div className={styles.container}>
    <div className={styles.addPageTop}>
       <TopBar />
    </div>
    <div className={styles.center}>
       <div className={styles.left} onClick={goBack}>
           <SvgIcon name="fanhui" width={"24"} height={"24"}></SvgIcon>
           <div className={styles.text}>返回</div>
       </div>
       <div className={styles.middle}>
           <div className={styles.export}>
               <SvgIcon name="daochu" width={"24"} height={"24"}></SvgIcon>
               <div className={styles.text}>导出模板</div> 
           </div>
           <div className={styles.import}>
               <SvgIcon name="daoru" width={"24"} height={"24"}></SvgIcon>
               <div className={styles.text}>导入模板</div>
           </div>
           <div className={styles.reset}>
               <SvgIcon name="chognzhi" width={"24"} height={"24"}></SvgIcon>
               <div className={styles.text}>重置问卷</div>
           </div>
       </div>
       <div className={styles.right}>
           <div className={styles.preview}>保存</div>
           <div className={styles.saveQuestionnaire}>保存并发布问卷</div>
       </div>
    </div>
    <div className={styles.bottom}>
      {/* 左侧区域，添加题型 */}
      <QuestionTypePanel />
      {/* 中间编辑区域 */}
      <CenterArea />
      {/* 右侧区域，添加题目属性 */}
      <QuestionPropertyPanel />
    </div>
    
    
  </div>
}