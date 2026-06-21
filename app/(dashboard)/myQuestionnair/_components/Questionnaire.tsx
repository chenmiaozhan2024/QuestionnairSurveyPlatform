'use client'

import { useEffect, useState } from 'react'
import { Spin, Pagination, message } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import { request } from '@/lib/request'
import styles from './Questionnaire.module.css'

interface QuestionnaireItem {
  id: number
  title: string
  info: string
  url:string
  status: number       // 0: 待收集  1: 已结束
  createTime: string
  totalCollected: number
}

export default function Questionnaire({ choice }: { choice: string }) {
  const [list, setList] = useState<QuestionnaireItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const fetchList = async (page = 1) => {
    setLoading(true)
    try {
      const data = await request<{ data: QuestionnaireItem[]; totalData: number }>(
        `/api/questionnaire?page=${page}&size=${pageSize}&choice=${choice}`
      )
      setList(data.data || [])
      setTotal(data.totalData || 0)
    } catch {
      message.error('获取问卷列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [choice])

  useEffect(() => {
    fetchList(currentPage)
  }, [currentPage, choice])
  const toggleStatus = async (id: number) => {
    try {
      await request<{ data: QuestionnaireItem }>(
        `/api/questionnaire/toggleStatus?id=${id}`
      )
      fetchList(currentPage)
    } catch {
      message.error('切换问卷状态失败')
    }
  }
    const formatDate = (timeStr?: string) => {
        console.log('createTime',timeStr)
        if (!timeStr) return '未知时间';

        try {
            let year, month, day;

            // 处理中文格式："2025年10月27日 12:01" 或 "2025年10月27日"
            if (timeStr.includes('年') && timeStr.includes('月') && timeStr.includes('日')) {
                // 提取日期部分（去掉后面的时间）
                const datePart = timeStr.split(' ')[0]; // 得到 "2025年10月27日"
                // 切割出年、月、日
                [year, month, day] = datePart
                    .replace('年', '-')
                    .replace('月', '-')
                    .replace('日', '')
                    .split('-')
                    .map(Number); // 转为数字
            } else {
                // 处理常规格式（如 ISO 格式、"2025-10-27" 等）
                const date = new Date(timeStr);
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
            }

            // 验证解析结果是否有效
            if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
                throw new Error('无效日期');
            }

            return `${year}/${month}/${day}`;
        } catch (err) {
            console.error('日期格式化失败', err);
            return '格式错误';
        }
    };

  return (
    <div className={styles.container}>
      <Spin spinning={loading} description="加载中...">
        <div className={styles.list}>
          {list.map((item) => (
            <div key={item.id} className={styles.card}>
                 <div className={styles.questionnaireTop}>
                        <div className={styles.svgAndText}>
                            <SvgIcon name="wenjian" width="30" height="30" />
                            {/* 动态显示问卷标题（替换为实际字段名） */}
                            <div className={styles.text}>{item.title || '未命名问卷'}</div>
                        </div>
                        {/* 动态显示最近修改时间（替换为实际字段名） */}
                        <div className={styles.days}>最近更改于 {formatDate(item.createTime) || '未知时间'}</div>
              </div>
                {/* 分割线 */}
              <div className={styles.line}></div>
              
              {/* <div className={styles.cardLeft}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.info}>
                   <div className="stop" onClick={() => { toggleStatus(item.id) }}>
                      {item.status === 0 ? (
                          <SvgIcon name="tingzhi" width={"30"} height={"30"}></SvgIcon>
                        ) : (
                          <SvgIcon name="kaishi" width={"30"} height={"30"}></SvgIcon>
                        )}
                        <div className="text">{item.status === 0 ? '停止' : '开始'}</div>
                    </div>
                  <span className={styles.time}>{item.createTime}</span>
                  <span className={styles.count}>{item.totalCollected} 份答卷</span>
                </div>
              </div> */}
              {/* <div className={styles.cardRight}>
                <SvgIcon name="tongji" width="24" height="24" />
                <SvgIcon name="delete" width="24" height="24" />
              </div> */}
            </div>
          ))}
        </div>
      </Spin>

      {total >= pageSize && (
        <Pagination
          align="center"
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      )}
    </div>
  )
}
