import SparkMD5 from 'spark-md5'
import {
  reqInitChunk,
  reqUploadChunk,
  reqMergeChunks,
  reqChunkStatus,
  reqCancelChunks,
} from '@/services/file/file'
import type { UploadState } from '@/services/file/type'

/** 默认每个分片 5MB */
const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024
/** localStorage key 前缀 */
const STORAGE_PREFIX = 'upload_state_'

export type ChunkUploaderState =
  | 'idle'
  | 'hashing'
  | 'checking'
  | 'uploading'
  | 'paused'
  | 'merging'
  | 'completed'
  | 'cancelled'
  | 'error'

export interface ChunkUploaderCallbacks {
  onProgress?: (percent: number) => void
  onStateChange?: (state: ChunkUploaderState) => void
}

export class ChunkUploader {
  state: ChunkUploaderState = 'idle'
  progress = 0
  private file: File
  private callbacks: ChunkUploaderCallbacks
  private fileHash = ''
  private totalChunks = 0
  private completedChunks: number[] = []
  private chunkSize: number
  private paused = false
  private currentController: AbortController | null = null
  private cancelled = false

  constructor(
    file: File,
    callbacks: ChunkUploaderCallbacks = {},
    chunkSize: number = DEFAULT_CHUNK_SIZE,
  ) {
    this.file = file
    this.callbacks = callbacks
    this.chunkSize = chunkSize
    this.totalChunks = Math.ceil(file.size / chunkSize)
  }

  private setState(state: ChunkUploaderState) {
    this.state = state
    this.callbacks.onStateChange?.(state)
  }

  private setProgress(p: number) {
    this.progress = Math.min(Math.round(p), 100)
    this.callbacks.onProgress?.(this.progress)
  }

  /** 计算文件MD5（增量读取，非阻塞） */
  private async computeHash(): Promise<string> {
    return new Promise((resolve, reject) => {
      const spark = new SparkMD5.ArrayBuffer()
      const reader = new FileReader()
      let offset = 0
      const sliceSize = 2 * 1024 * 1024 // 2MB slices

      const loadNext = () => {
        if (this.cancelled) {
          reject(new Error('已取消'))
          return
        }
        const slice = this.file.slice(offset, offset + sliceSize)
        reader.readAsArrayBuffer(slice)
      }

      reader.onload = (e) => {
        spark.append(e.target!.result as ArrayBuffer)
        offset += sliceSize
        if (offset >= this.file.size) {
          resolve(spark.end())
        } else {
          // 使用 setTimeout 避免阻塞UI
          setTimeout(loadNext, 0)
        }
      }

      reader.onerror = () => reject(new Error('文件读取失败'))
      loadNext()
    })
  }

  /** 保存状态到 localStorage */
  private saveState() {
    const state: UploadState = {
      fileHash: this.fileHash,
      fileName: this.file.name,
      fileSize: this.file.size,
      totalChunks: this.totalChunks,
      completedChunks: [...this.completedChunks],
      date: new Date().toISOString(),
    }
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}${this.fileHash}`,
        JSON.stringify(state),
      )
    } catch {
      // localStorage 满了，忽略
    }
  }

  /** 从 localStorage 恢复状态（静态方法，供页面调用） */
  static getSavedStates(): UploadState[] {
    const results: UploadState[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        try {
          const state = JSON.parse(localStorage.getItem(key)!) as UploadState
          results.push(state)
        } catch {
          // 忽略损坏的数据
        }
      }
    }
    return results
  }

  /** 清除特定 hash 的状态 */
  private clearState() {
    localStorage.removeItem(`${STORAGE_PREFIX}${this.fileHash}`)
  }

  /** 开始上传 */
  async start() {
    try {
      this.cancelled = false
      this.paused = false

      // 1. 计算文件 MD5
      this.setState('hashing')
      this.fileHash = await this.computeHash()
      if (this.cancelled) return

      // 2. 检查后台是否有未完成的上传
      this.setState('checking')
      const statusRes = await reqChunkStatus(this.fileHash)
      if (this.cancelled) return

      let uploadedChunks: number[] = []

      if (
        statusRes.code === 1 &&
        statusRes.data?.exists &&
        statusRes.data.completedChunks.length > 0
      ) {
        // 有已上传的分片，从 localStorage 合并
        const saved = this.getSavedStateForHash(this.fileHash)
        if (saved) {
          uploadedChunks = saved.completedChunks
        } else {
          uploadedChunks = statusRes.data.completedChunks
        }
      }

      // 3. 初始化或恢复
      if (uploadedChunks.length === 0) {
        const initRes = await reqInitChunk(
          this.file.name,
          this.totalChunks,
          this.fileHash,
          this.file.size,
        )
        if (this.cancelled) return
        if (initRes.code !== 1) {
          throw new Error(initRes.msg || '初始化分片上传失败')
        }
        uploadedChunks = initRes.data.uploadedChunks || []
      }

      this.completedChunks = [...uploadedChunks]
      this.saveState()

      // 计算已上传进度
      const totalBytes = this.file.size
      const chunkBytes = totalBytes / this.totalChunks
      const uploadedBytes = this.completedChunks.length * chunkBytes
      this.setProgress((uploadedBytes / totalBytes) * 100)

      // 4. 上传每个缺失的分片
      this.setState('uploading')
      for (let i = 0; i < this.totalChunks; i++) {
        if (this.completedChunks.includes(i)) continue

        // 检查暂停
        if (this.paused) {
          await this.waitForResume()
          if (this.cancelled) return
        }

        await this.uploadChunk(i)
        if (this.cancelled) return

        // 更新进度
        const doneBytes = this.completedChunks.length * chunkBytes
        this.setProgress(Math.min((doneBytes / totalBytes) * 100, 99))
      }

      // 5. 所有分片完成 → 合并
      this.setState('merging')
      const mergeRes = await reqMergeChunks(this.fileHash)
      if (mergeRes.code !== 1) {
        throw new Error(mergeRes.msg || '合并分片失败')
      }

      // 6. 清理
      this.clearState()
      this.setProgress(100)
      this.setState('completed')
      return mergeRes
    } catch (err) {
      if (this.cancelled) {
        this.setState('cancelled')
      } else {
        this.setState('error')
        throw err
      }
    }
  }

  /** 上传单个分片 */
  private async uploadChunk(index: number) {
    const start = index * this.chunkSize
    const end = Math.min(start + this.chunkSize, this.file.size)
    const chunkBlob = this.file.slice(start, end)

    const formData = new FormData()
    formData.append('chunk', chunkBlob, `${this.file.name}.part${index}`)
    formData.append('fileHash', this.fileHash)
    formData.append('chunkIndex', String(index))

    this.currentController = new AbortController()

    const res = await reqUploadChunk(formData, this.currentController.signal)

    if (res.code !== 1) {
      throw new Error(res.msg || `第 ${index + 1} 个分片上传失败`)
    }

    this.completedChunks.push(index)
    this.saveState()
    this.currentController = null
  }

  /** 暂停上传 */
  pause() {
    this.paused = true
    if (this.currentController) {
      this.currentController.abort()
      this.currentController = null
    }
    this.setState('paused')
  }

  /** 继续上传 */
  resume() {
    this.paused = false
  }

  /** 取消上传 */
  async cancel() {
    this.cancelled = true
    this.paused = false
    if (this.currentController) {
      this.currentController.abort()
      this.currentController = null
    }
    if (this.fileHash) {
      try {
        await reqCancelChunks(this.fileHash)
      } catch {
        // 忽略清理错误
      }
      this.clearState()
    }
    this.setState('cancelled')
  }

  /** 等待恢复（暂停时阻塞） */
  private async waitForResume(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if (this.cancelled || !this.paused) {
          resolve()
        } else {
          setTimeout(check, 200)
        }
      }
      check()
    })
  }

  /** 获取保存的状态 */
  private getSavedStateForHash(hash: string): UploadState | null {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${hash}`)
      if (raw) return JSON.parse(raw) as UploadState
    } catch {
      // ignore
    }
    return null
  }
}
