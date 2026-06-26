export interface filesItemType {
  id: string
  fileTureName: string
  fileUUIDName: string
  date: string
}
export interface FileListResult {
  data: filesItemType[]
  totalData: number
}