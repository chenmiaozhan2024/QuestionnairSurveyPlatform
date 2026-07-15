import { request } from '@/lib/request'
import { FileListResult } from './type'
const FILE_URLS = {
  list: '/api/file',
  detail: '/api/file',
  upload: '/api/file',
  delete: '/api/file',
}

// 获取所有的文件
export const reqFileList = (page: number, pageSize: number) => {
  return request.get<FileListResult>(
    `${FILE_URLS.list}?page=${page}&size=${pageSize}`,
  )
}
// 根据id删除文件
export const reqDeleteFile = (id: string) =>
  request.delete(`${FILE_URLS.delete}?id=${id}`, { method: 'DELETE' })
// 根据fileUUID获取文件路径
export const reqFileByUUID = (fileUUID: string) =>
  request.get(`${FILE_URLS.detail}/${fileUUID}`)
// 上传文件
export const reqUploadFile = (formData: FormData) =>
  request.post(FILE_URLS.upload, formData)

// === 大文件分片上传 ===

// 初始化分片上传
export const reqInitChunk = (
  fileName: string,
  totalChunks: number,
  fileHash: string,
  fileSize: number,
) =>
  request.post<{ code: number; msg: string; data: { uploadId: string; uploadedChunks: number[] } }>(
    `${FILE_URLS.upload}/chunk/init`,
    { fileName, totalChunks, fileHash, fileSize },
  )

// 查询分片状态
export const reqChunkStatus = (fileHash: string) =>
  request.get<{ code: number; msg: string; data: any }>(
    `${FILE_URLS.upload}/chunk/status?fileHash=${fileHash}`,
  )

// 上传单个分片
export const reqUploadChunk = (
  formData: FormData,
  signal?: AbortSignal,
) =>
  request.post<{ code: number; msg: string; data: { chunkIndex: number; success: boolean } }>(
    `${FILE_URLS.upload}/chunk/upload`,
    formData,
    { signal } as any,
  )

// 合并分片
export const reqMergeChunks = (fileHash: string) =>
  request.post<{ code: number; msg: string; data: any }>(
    `${FILE_URLS.upload}/chunk/merge`,
    { fileHash },
  )

// 取消分片上传
export const reqCancelChunks = (fileHash: string) =>
  request.delete(`${FILE_URLS.upload}/chunk/cancel?fileHash=${fileHash}`)
