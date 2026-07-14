'use client'
import styles from './page.module.css'
import { useParams } from "next/navigation"
import Topbar from '@/app/_components/Topbar/Topbar'
import SvgIcon from '@/components/SvgIcon'
import {useRouter} from 'next/navigation'
import { getAllFinllIn, getFinllInById } from '@/services/statistics/statistics'
import { useEffect, useState } from 'react'
import {Question } from '@/services/statistics/type'
import { formatDate } from '@/lib/utlisFuntion'
import type {FileItem} from '@/services/file/type'
import { message,} from 'antd'
import MyTablePlus from '../_conponents/MyTablePlus/MyTablePlus'
import type {FinllInItem } from '@/services/statistics/type'
export default function Page() {
  const { id } = useParams()
  const [total, setTotal] = useState<number>(0);
  const [reData, setReData] = useState<FinllInItem[]>([]);
  const [title, setTitle] = useState<string>();
  const [info, setInfo] = useState<string>();
  const [createTime, setCreateTime] = useState<string>();
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<string[]>([]); // 文件ID数组
  const [fileList, setFileList] = useState<FileItem[]>([]); // 所有文件列表（用于匹配文件信息）
  // const [currentRecord, setCurrentRecord] = useState<TableRowData | null>(null);
  // 处理返回按钮点击
  const router = useRouter()
  const handleBack = () => {
      router.push('/')
  };
  const getData= async (id:string, page:number = 1, size:number = 10)=>{
        const params={
            page:page,
            size:size,
            id:id
        }
        try {
          // 获取答卷
          const res2 = await getFinllInById(params.id)
          setTitle(res2.data.title)
          setInfo(res2.data.info)
          setCreateTime(formatDate(res2.data.createTime))
            setQuestions(res2.data.questions || [])
            message.success('获取数据成功')
        }catch(err){
            console.error(err);
            // message.error('获取数据失败')
        }
  }
    
  useEffect(() => {
    getData(id as string, current, pageSize);
  }, [])
  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.statisticTop}>
        <Topbar></Topbar>
      </div>
      <div className={styles.statisticCenter}>
         <div className={styles.centerLeft} onClick={handleBack} style={{cursor: 'pointer'}}>
            <SvgIcon name="fanhui" width={"24"} height={"24"}></SvgIcon>
             <div className={styles.text}>返回</div>
        </div>
        <div className={styles.centerMiddle}>
            <div className={styles.desc}>【{title}】-- {createTime}</div>
        </div>
        <div className={styles.centerRight}>
          <div className={styles.origin}>导出原始表格(csv)</div>
          <div className={styles.origin}>导出汇总表格(csv)</div>
        </div>
        
      </div>
       <div className={styles.centerBottom}>
        <div className={styles.main}>
            <div className={styles.table}>
              <MyTablePlus title={title} createTime={createTime}></MyTablePlus>
            </div>
          </div>
          </div>
    </div>
  )
}