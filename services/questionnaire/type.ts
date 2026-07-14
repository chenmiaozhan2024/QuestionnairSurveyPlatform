export interface QuestionnaireItem {
  id: string
  title: string
  info: string
  createTime: string
  status: number
  totalCollected: string
}
interface QuestionnaireData {
  totalData: number
  data: QuestionnaireItem[]
  totalPage: number
}
export interface QuestionnaireResult {
  code: number
  msg: string
  data: QuestionnaireData
}
