import { request } from '@/lib/request'
const fileAPI = {
  getFileList: '/api/file',
  deleteFileById: '/api/file',
}
interface FileItem {
  id: number
  fileTureName: string
  fileUUIDName: string
  date: string
}
interface FileListResult {
  data: FileItem[]
  total: number
}
export const reqFileList = (page: number, pageSize: number) => {
  return request<FileListResult>(
    `${fileAPI.getFileList}?page=${page}&size=${pageSize}`,
  )
}
export const reqDeleteFile = (id: number) =>
  request(`${fileAPI.deleteFileById}?id=${id}`, { method: 'DELETE' })
