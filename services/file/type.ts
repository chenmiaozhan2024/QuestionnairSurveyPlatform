export interface filesItemType {
  _id: string
  fileTureName: string
  fileUUIDname: string
  date: string
}
export interface FileListResult {
  data: {
    data: filesItemType[]
    totalData: number
  }
}
