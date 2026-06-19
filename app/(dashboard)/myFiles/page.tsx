'use client'

import { useEffect, useState } from 'react'
import { Upload, Button, Spin, Pagination, message } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import { request } from '@/lib/request'
import styles from './page.module.css'

interface FileItem {
  id: number
  fileTureName: string   // 实际文件名
  fileUUIDName: string    // 服务器存储的 UUID 文件名
  date: string
}

export default function MyFilesPage() {
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // 请求文件列表
  const fetchFileList = async (page = 1) => {
    setLoading(true)
    try {
      const data = await request<{ records: FileItem[]; total: number }>(
        `/api/file?page=${page}&size=${pageSize}`
      )
      setFileList(data.records || [])
      setTotal(data.total || 0)
    } catch {
      message.error('获取文件列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFileList(currentPage)
  }, [currentPage])

  // 上传
  const uploadProps = {
    name: 'file',
    action: '/api/file/upload',
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success('上传成功')
        fetchFileList(currentPage)
      } else if (info.file.status === 'error') {
        message.error('上传失败')
      }
    },
  }

  // 预览文件
  const handleFileSee = (uuidName: string) => {
    window.open(`/file/preview/${uuidName}`, '_blank')
  }

  // 删除文件
  const handleDeleteFile = async (id: number) => {
    try {
      await request(`/api/file/delete/${id}`, { method: 'DELETE' })
      message.success('删除成功')
      fetchFileList(currentPage)
    } catch {
      message.error('删除失败')
    }
  }

  // 分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Upload {...uploadProps} className={styles.customUpload}>
          <Button className={styles.customButton}>上传文件</Button>
        </Upload>
        <div className={styles.right}></div>
      </div>

      <Spin spinning={loading} description="加载中...">
        <div className={styles.bottom}>
          <ul>
            {fileList.map((item) => (
              <li key={item.id}>
                <div className={styles.fileTop}>
                  <SvgIcon name="wenjian" width="30" height="30" />
                  <div className={styles.text}>{item.fileTureName}</div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.fileBottom}>
                  <div className={styles.time}>{item.date || '2025/4/25'}</div>
                  <div className={styles.icon}>
                    <SvgIcon
                      name="eye"
                      width="30"
                      height="30"
                      onClick={() => handleFileSee(item.fileUUIDName)}
                    />
                    <SvgIcon
                      name="bin"
                      width="30"
                      height="30"
                      onClick={() => handleDeleteFile(item.id)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Spin>

      {total >= pageSize && (
        <Pagination
          align="center"
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      )}
    </div>
  )
}
