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
