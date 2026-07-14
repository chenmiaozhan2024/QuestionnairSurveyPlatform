'use client'
import SvgIcon from '@/components/SvgIcon'
import style from './MyTablePlus.module.css'
import { MyTablePlusProps } from './type'


const MyTablePlus = ({ title,createTime }: MyTablePlusProps) => {
  return (
    <div className={style.tablePlusContainer}>
      <div className={style.tablePlusleft}>
        <div className={style.total}>问卷统计（共12条数据）</div>
        <div className={style.header}>
          <ul className={style.ul}>
            <li>
              <div className={style.key}>姓名</div>
               <div className={style.line}></div>
            </li>
            <li>
              <div className={style.key}>性别</div>
               <div className={style.line}></div>
            </li>
            <li>
              <div className={style.key}>电话号码</div>
               <div className={style.line}></div>
            </li>
            <li>
               <div className={style.key}> 职称</div>
               <div className={style.line}></div>
            </li>
            <li>
              <div className={style.key}>单位名称</div>
               <div className={style.line}></div>
            </li>
            <li>
                <div className={style.key}>题目反馈</div>
               <div className={style.line}></div>
            </li>
            <li>
              <div className={style.key}>提交时间</div>
               <div className={style.line}></div>
              </li>
            <li>操作</li>
          </ul>
        </div>
      </div>
      <div className={style.tablePlusRight}>
        <div className={style.tablePlusRightTop}>
          <div className={style.title}>{title || '标题'}--{createTime}</div>
          <div className={style.files}>
             <SvgIcon name="wenjian" width="30" height="30" />
          </div>
        </div>
        <div className={style.tablePlusRightBottom}>
          11
        </div>
      </div>
    </div>
  )
}
export default MyTablePlus