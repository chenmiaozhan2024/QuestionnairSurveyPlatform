export interface FileItem {
  _id: string
  fileTureName: string
  fileUUIDname: string
  date: string
  fileSize?: number
  fileHash?: string
}
interface FileListData {
  data: FileItem[]
  totalData: number
}
export interface FileListResult {
  code: number
  msg: string
  data: FileListData
}

// 分片上传相关类型
export interface ChunkInitResult {
  code: number
  msg: string
  data: { uploadId: string; uploadedChunks: number[] }
}

export interface ChunkUploadResult {
  code: number
  msg: string
  data: { chunkIndex: number; success: boolean }
}

export interface ChunkMergeResult {
  code: number
  msg: string
  data: {
    id: string
    fileTureName: string
    fileUUIDname: string
    date: string
    url: string
  }
}

export interface ChunkStatusResult {
  code: number
  msg: string
  data: {
    exists: boolean
    uploading: boolean
    completedChunks: number[]
    totalChunks: number
    fileName: string
  }
}

export interface ChunkUploadOptions {
  file: File
  chunkSize?: number   // 每片大小，默认 5MB
  onProgress?: (percent: number) => void
}

/** localStorage 中保存的上传状态 */
export interface UploadState {
  fileHash: string
  fileName: string
  fileSize: number
  totalChunks: number
  completedChunks: number[]
  date: string
}
