import type { SurveyData, Question } from '@/services/statistics/type'

export interface TableRowData {
  key: number
  index: number
  collectTime: string
  id?: string
  surveyId?: string
  [key: string]: string | number | undefined // 动态字段（题目ID对应的答案值）
}

export interface MyTableProps {
  tableData: SurveyData // SurveyData 是你定义的数组类型（SurveyDataItem[]）
  questions: Question[] // 题目列表
  onEdit?: (record: TableRowData) => void // 编辑按钮点击回调
  onDelete?: (record: TableRowData) => void // 删除按钮点击回调
  userRole?: number | string | null // 用户角色："0"或0-超级管理员，"1"或1-普通管理员
}
export interface optionsType {
  text: string
  id: string
}
export interface groupsItemType {
  id?: string
  type?: null
  title?: null
  info?: null
  required?: boolean
  options?: optionsType[]
}
export interface answerItemType {
  id: string
  type?: string
  groups?: groupsItemType[]
  subTitles?: null
  options?: null
  title?: null
  info?: null
  required: boolean
}
export interface TableColumnsItemType {
  id: string
  type?: string
  text?: string
  width?: string
}
