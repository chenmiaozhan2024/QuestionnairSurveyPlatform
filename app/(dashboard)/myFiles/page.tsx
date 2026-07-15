'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Upload, Button, Spin, Pagination, message, Popconfirm, Progress } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import { request } from '@/lib/request'
import styles from './page.module.css'
import { reqDeleteFile, reqFileList, reqUploadFile } from '@/services/file/file'
import { ChunkUploader, type ChunkUploaderState } from '@/lib/chunkUpload'
import type { FileItem } from '@/services/file/type'

export default function MyFilesPage() {
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [uploadPercent, setUploadPercent] = useState<number | null>(null)
  const [chunkState, setChunkState] = useState<ChunkUploaderState>('idle')
  const pageSize = 10

  const uploaderRef = useRef<ChunkUploader | null>(null)

  /** 超过此大小的文件走分片上传，默认 5MB */
  const CHUNK_THRESHOLD = 5 * 1024 * 1024

  // 请求文件列表
  const fetchFileList = async (page = 1) => {
    setLoading(true)
    try {
      const data = await reqFileList(page, pageSize)
      setFileList(data.data.data || [])
      setTotal(data.data.totalData || 0)
    } catch {
      message.error('获取文件列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFileList(currentPage)
  }, [currentPage])

  // 页面加载时检查是否有未完成的断点续传
  useEffect(() => {
    const savedStates = ChunkUploader.getSavedStates()
    if (savedStates.length > 0) {
      const names = savedStates.map((s) => s.fileName).join('、')
      message.info(`检测到未完成的上传：${names}，请重新选择相同文件以续传`, 5)
    }
  }, [])

  // 上传文件 API（自动选择普通上传或分片上传）
  const uploadFileAPI = useCallback(
    async (file: File, onProgress?: (p: number) => void) => {
      // 小文件走普通上传
      if (file.size <= CHUNK_THRESHOLD) {
        const formData = new FormData()
        formData.append('files', file)
        const res = await reqUploadFile(formData)
        if (res.code !== 1) {
          throw new Error(res.msg || '上传失败')
        }
        return
      }

      // 大文件走分片上传
      const uploader = new ChunkUploader(file, {
        onProgress: (p) => {
          setUploadPercent(p)
          onProgress?.(p)
        },
        onStateChange: (state) => setChunkState(state),
      })
      uploaderRef.current = uploader

      try {
        return await uploader.start()
      } finally {
        uploaderRef.current = null
      }
    },
    [],
  )

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options
    try {
      setUploadPercent(0)
      setChunkState('idle')
      await uploadFileAPI(file, (p) => setUploadPercent(p))
      onSuccess?.('上传成功', file)
      fetchFileList()
    } catch (error) {
      console.error('文件上传失败:', error)
      onError?.(error)
    } finally {
      // 只有在完成/取消/错误时才清除进度
      if (chunkState !== 'uploading' && chunkState !== 'paused') {
        setUploadPercent(null)
        setChunkState('idle')
      }
    }
  }

  const handlePause = () => {
    uploaderRef.current?.pause()
  }

  const handleResume = () => {
    uploaderRef.current?.resume()
  }

  const handleCancel = async () => {
    setUploadPercent(null)
    setChunkState('idle')
    await uploaderRef.current?.cancel()
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
      await reqDeleteFile(id)
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
      <div className={styles.title}>我的文件</div>
      <div className={styles.top}>
        <Upload {...uploadProps} className={styles.customUpload}>
          <Button className={styles.customButton}>上传文件</Button>
        </Upload>
        <div className={styles.right}></div>
      </div>

      {/* 上传进度区域 */}
      {uploadPercent !== null && (
        <div style={{ width: '450px', margin: '12px 0' }}>
          {/* 哈希计算中 */}
          {chunkState === 'hashing' && (
            <div style={{ marginBottom: 8, color: '#328B99', fontSize: 14 }}>
              正在计算文件指纹...
            </div>
          )}

          {/* 上传进度条 */}
          <Progress
            percent={uploadPercent}
            status={chunkState === 'error' ? 'exception' : 'active'}
          />

          {/* 操作按钮 */}
          {(chunkState === 'uploading' || chunkState === 'paused') && (
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              {chunkState === 'uploading' ? (
                <Button size="small" onClick={handlePause}>
                  暂停
                </Button>
              ) : (
                <Button size="small" onClick={handleResume}>
                  继续
                </Button>
              )}
              <Button size="small" danger onClick={handleCancel}>
                取消
              </Button>
            </div>
          )}

          {chunkState === 'merging' && (
            <div style={{ marginTop: 4, color: '#328B99', fontSize: 13 }}>
              正在合并文件...
            </div>
          )}
        </div>
      )}

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
