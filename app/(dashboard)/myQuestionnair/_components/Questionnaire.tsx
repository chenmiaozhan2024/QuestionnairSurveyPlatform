'use client'

import { useEffect, useState } from 'react'
import { Spin, Pagination, Popconfirm, Modal, Button, message } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import { request } from '@/lib/request'
import styles from './Questionnaire.module.css'

interface QuestionnaireItem {
  id: string
  title: string
  info: string
  url: string
  status: number       // 0: 待收集  1: 已结束
  createTime: string
  totalCollected: number
}

interface Props {
  choice: string
  type?: 'normal' | 'recycle'
}

export default function Questionnaire({ choice, type = 'normal' }: Props) {
  const [list, setList] = useState<QuestionnaireItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [qrModalVisible, setQrModalVisible] = useState(false)
  const [currentQrId, setCurrentQrId] = useState<string | null>(null)
  const pageSize = 4

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

  // 切换问卷状态
  const toggleStatus = async (id: string) => {
    const currentItem = list.find((item) => item.id === id)
    // console.log(currentItem)
    if (!currentItem) return
    const newStatus = currentItem.status === 0 ? 1 : 0
    try {
      await request(`/api/questionnaire/status?id=${id}&newStatus=${newStatus}`, { method: 'PUT' })
      setList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      )
      message.success(`问卷已${newStatus === 1 ? '停止收集' : '开始收集'}`)
    } catch {
      message.error('更新问卷状态失败')
    }
  }

  // 统计
  const handleStatistics = (id: string) => {
    window.open(`/statistics/${id}`, '_blank')
  }

  // 复制链接
  const handleCopyLink = async (id: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const link = `${baseUrl}/fill/${id}`
    try {
      await navigator.clipboard.writeText(link)
      message.success('链接已复制到剪贴板')
    } catch {
      message.error('复制失败')
    }
  }

  // 删除问卷
  const handleDelete = async (id: string) => {
    try {
      await request(`/api/questionnaire/status?id=${id}&newStatus=2`, { method: 'PUT' })
      message.success('删除成功')
      fetchList(currentPage)
    } catch {
      message.error('删除失败')
    }
  }

  // 恢复问卷
  const handRecover = async (id: string) => {
    try {
      await request(`/api/questionnaire/status?id=${id}&newStatus=1`, { method: 'PUT' })
      message.success('恢复成功')
      fetchList(currentPage)
    } catch {
      message.error('恢复失败')
    }
  }

  const formatDate = (timeStr?: string) => {
    if (!timeStr) return '未知时间'
    try {
      let year: number, month: number, day: number
      if (timeStr.includes('年') && timeStr.includes('月') && timeStr.includes('日')) {
        const datePart = timeStr.split(' ')[0]
        ;[year, month, day] = datePart
          .replace('年', '-')
          .replace('月', '-')
          .replace('日', '')
          .split('-')
          .map(Number)
      } else {
        const date = new Date(timeStr)
        year = date.getFullYear()
        month = date.getMonth() + 1
        day = date.getDate()
      }
      if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
        throw new Error('无效日期')
      }
      return `${year}/${month}/${day}`
    } catch {
      return '格式错误'
    }
  }

  return (
    <div className={styles.container}>
      <Spin spinning={loading} description="加载中...">
        <div className={styles.list}>
          {list.map((item) => (
            <div key={item.id} className={styles.card}>
              {/* 卡片顶部：图标+标题 与 日期 */}
              <div className={styles.questionnaireTop}>
                <div className={styles.svgAndText}>
                  <SvgIcon name="wenjian" width="30" height="30" />
                  <div className={styles.titleText}>{item.title || '未命名问卷'}</div>
                </div>
                <div className={styles.days}>最近更改于 {formatDate(item.createTime)}</div>
              </div>

              {/* 分割线 */}
              <div className={styles.divider}></div>

              {/* 卡片底部：状态区 / 操作区 / 右侧按钮 */}
              <div className={styles.cardBottom}>
                {type === 'normal' ? (
                  <div className={styles.leftArea}>
                    {item.status === 0 ? (
                      <div className={styles.statusBtn} style={{ background: '#87CEEB' }}>收集中</div>
                    ) : (
                      <div className={styles.statusBtn}>已停止</div>
                    )}
                    <div className={styles.toggleBtn} onClick={() => toggleStatus(item.id)}>
                      {item.status === 0 ? (
                        <SvgIcon name="tingzhi" width="30" height="30" />
                      ) : (
                        <SvgIcon name="kaishi" width="30" height="30" />
                      )}
                      <div className={styles.toggleText}>{item.status === 0 ? '停止' : '开始'}</div>
                    </div>
                    <div className={styles.collected}>已收集{item.totalCollected || 0}份</div>
                  </div>
                ) : (
                  <div className={styles.leftArea}>
                      <div className={styles.delete}>已删除</div>
                       <div className={styles.collected}>已收集{item.totalCollected || 0}份</div>
                  </div>
                )}

                {type === 'normal' && (
                  <div className={styles.middleArea}>
                    <ul>
                      <li onClick={() => handleStatistics(item.id)}>
                        <SvgIcon name="tongji" width="26" height="26" />
                        <div className={styles.actionText}>统计</div>
                      </li>
                      <li>
                        <SvgIcon name="lianjie" width="24" height="24" />
                        <div className={styles.actionText} onClick={() => handleCopyLink(item.id)}>复制链接</div>
                      </li>
                      <li>
                        <SvgIcon name="erweima" width="24" height="24" />
                        <div className={styles.actionText} onClick={() => {
                          setCurrentQrId(item.id)
                          setQrModalVisible(true)
                        }}>生成二维码</div>
                      </li>
                    </ul>
                  </div>
                )}

                {type === 'normal' ? (
                  <div className={styles.rightArea}>
                    <div className={styles.preview} onClick={() => window.open(`/add?id=${item.id}`, '_blank')}>预览</div>
                    <Popconfirm
                      title={`确定要删除${item.title}这份问卷吗？`}
                      onConfirm={() => handleDelete(item.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <div className={styles.deleteBtn}>删除</div>
                    </Popconfirm>
                  </div>
                ) : (
                  <div className={styles.rightArea}>
                    <Popconfirm
                      title={`确定要恢复${item.title}这份问卷吗？`}
                      onConfirm={() => handRecover(item.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <div className={styles.recoverBtn}>恢复</div>
                    </Popconfirm>
                  </div>
                )}
              </div>
            </div>
          ))}

          {list.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无问卷数据</div>
          )}
        </div>
      </Spin>

      {total >= pageSize && (
        <Pagination
          className={styles.pagination}
          align="center"
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        showTotal={(total) => `共 ${total} 条`}
        />
      )}

      {/* 二维码弹窗 */}
      <Modal
        title="扫描二维码填写问卷"
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="copy" onClick={() => currentQrId && handleCopyLink(currentQrId)}>复制链接</Button>,
          <Button key="close" onClick={() => setQrModalVisible(false)}>关闭</Button>,
        ]}
      >
        <div style={{ textAlign: 'center', padding: 20 }}>
          {/* 需要安装 qrcode.react: pnpm add qrcode.react */}
          {/* <QRCodeSVG value={`${window.location.origin}/fill/${currentQrId}`} size={200} /> */}
          <p>问卷链接: {currentQrId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/fill/${currentQrId}` : ''}</p>
        </div>
      </Modal>
    </div>
  )
}
