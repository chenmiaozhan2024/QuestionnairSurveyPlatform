export interface FileItem {
  _id: string
  fileTureName: string
  fileUUIDname: string
  date: string
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
