export interface QuestionnaireItem {
  id: string
  title: string
  info: string
  url: string
  status: number // 0: 待收集  1: 已结束
  createTime: string
  totalCollected: number
}

export interface QuestionnaireResult {
  data: QuestionnaireItem[]
  totalData: number
}
