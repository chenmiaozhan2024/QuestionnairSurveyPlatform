import Switch from './_components/Switch/Switch';
import styles from './QuestionPropertyPanel.module.css'
// interface QuestionPropertyPanelProps{
//   onQuestionClick:(question:Question)=>void
// }
export default function QuestionPropertyPanel() {
  return (
    <div className={styles.questionPropertyPanel}>
     <div className={styles.right}>
           <div className={styles.subjectTop}>
               <div className={styles.subject}>题目描述</div>
               <div className={styles.up}>上移</div>
               <div className={styles.down}>下移</div>
               <div className={styles.bixuan}>
                   <div className={styles.switch}>
                       <Switch/>
                       <div className={styles.requiredText}>必选题</div>
                   </div>
          </div>
         
          
        </div>
        <div className={styles.biliangEdit}>批量编辑</div>
        <div className={styles.biliangEditInput}>11</div>
           
           <div className={styles.subjectBottom}  onClick={() => {
           }}>删除</div>
      </div>
    </div>
  )
}
