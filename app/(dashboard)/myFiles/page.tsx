'use client'

import { useEffect, useState } from 'react'
import { Upload, Button, Spin, Pagination, message,Popconfirm } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import { request } from '@/lib/request'
import styles from './page.module.css'
import { reqDeleteFile, reqFileList, reqUploadFile } from '@/services/file/file'
import {filesItemType} from '@/services/file/type'

export default function MyFilesPage() {
  const [fileList, setFileList] = useState<filesItemType[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // 请求文件列表
  const fetchFileList = async (page = 1) => {
    setLoading(true)
    try {
      const data = await reqFileList(page, pageSize)
   
      // console.log(data);
      
      setFileList(data.data.data || [])
      // console.log(data.data.totalData);
      
      setTotal(data.data.totalData || 0)
       message.success('获取文件列表成功')
    } catch {
      message.error('获取文件列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFileList(currentPage)
  }, [currentPage])

  // 上传文件 API
  const uploadFileAPI = async (file: File) => {
  const formData = new FormData()
  formData.append('files', file)
  const res=await reqUploadFile(formData)
  if (res.code !== 1) {
    throw new Error(res.msg || '上传失败')
  }
}

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options
    try {
      await uploadFileAPI(file)
      onSuccess?.('上传成功', file)
      fetchFileList()
    } catch (error) {
      console.error('文件上传失败:', error)
      onError?.(error)
    }
  }

  const uploadProps: any = {
    name: 'files',
    customRequest,
    showUploadList: false,
    beforeUpload: (file: File) => {
      const isPDF = file.type === 'application/pdf'
      if (!isPDF) {
        message.error('只能上传 PDF 格式的文件!')
        return false
      }
      return true
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
        fetchFileList(currentPage)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  // 预览文件
 const handleFileSee = async (fileUUID: string) => {
  try {
    const res = await request.get<{ data: { url: string } }>(`/api/file/${fileUUID}`)
    const url = res.data.url
    if (url) {
      window.open(url, '_blank')
    } else {
      message.error('文件地址不存在')
    }
  } catch {
    message.error('预览失败')
  }
}

  // 删除文件
  const handleDeleteFile = async (id: string) => {
    try {
      // await request(`/api/file?id=${id}`, { method: 'DELETE' })
      console.log('传给 reqDeleteFile 的 id:', id, typeof id);
      await reqDeleteFile(id)
      message.success('删除成功')
      fetchFileList(currentPage)
    } catch {
      message.error('删除失败')
    } finally {
       console.log(id)
    }
  }

  // 分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>我的文件</div>
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
              <li key={item._id}>
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
                      onClick={() => handleFileSee(item.fileUUIDname)}
                    />
                    <Popconfirm
                      title={`确定要删除${item.fileTureName}文件么？`}
                      onConfirm={() => handleDeleteFile(item._id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <span style={{ cursor: 'pointer' }}>
                        <SvgIcon name="bin" width="30" height="30" />
                      </span>
                    </Popconfirm>
                   
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
