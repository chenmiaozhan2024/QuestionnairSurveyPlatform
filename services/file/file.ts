import { request } from '@/lib/request'
import { filesItemType,FileListResult } from './type'
const fileAPI = {
  getFileList: '/api/file',
  deleteFileById: '/api/file',
  getFileByUUIDName:'/api/file'
}

// 获取所有的文件
export const reqFileList = (page: number, pageSize: number) => {
  return request<FileListResult>(
    `${fileAPI.getFileList}?page=${page}&size=${pageSize}`,
  )
}
// 根据id删除文件
export const reqDeleteFile = (id: number) =>
  request(`${fileAPI.deleteFileById}?id=${id}`, { method: 'DELETE' })
// export const reqFileAPI = (fileUUIDName:string) => {
//   return request(fileAPI.getFileByUUIDName)
// }
