export interface FillInAnswer {
  _id: string
  type: string
  required: boolean
  text?: string
  options?: { _id: string; text: string }[]
  groups?: {
    _id: string
    required: boolean
    options: { _id: string; text: string }[]
  }[]
  _class: string
}

export interface FinllInItem {
  id: string
  answers: FillInAnswer[]
}
export interface FinllInData {
  data: FinllInItem[]
  totalData: number
  totalPage: number
}
export interface GetAllFinllInResponse {
  code: number
  msg: string
  data: FinllInData
}

export interface FinllInByIdData {
  id: string
  title: string
  info: string
  createTime: string
  status: number
  questions: Question[]
  totalCollected: number
  files?: string[]
}
export interface getFinllInByIdResPon {
  code: number
  msg: string
  data: FinllInByIdData
}

// getAllFinllIn 的响应类型
export interface data {
  answers: []
  collectTime: []
  files: null | string
  id: string
  info: null | string
  surveyId: string
  title: null | string
}

export interface Option {
  text: string
  id: string
}
export interface MatrixGroup {
  id: string
  type: string | null
  title: string | null
  info: string | null
  required: boolean
  options: Option[]
}
export interface SubTitle {
  id: string
  text: string
}
export interface Question {
  id: string
  type:
    | 'text'
    | 'single'
    | 'multi'
    | 'matrix_radio'
    | 'textarea'
    | 'select'
    | 'description'
  title: string
  info: string
  required: boolean
  options?: Option[] // 单选题/多选题的选项列表
  subTitles?: SubTitle[] // 矩阵题的子标题列表
}
export interface Answer {
  _id?: string
  type:
    | 'text'
    | 'single'
    | 'multi'
    | 'matrix_radio'
    | 'textarea'
    | 'select'
    | 'description'
  title?: string | null
  info?: string | null
  required: boolean
  text?: string // 文本类答案（text/textarea 类型）
  options?: Option[] // 单选题/多选题选项（single/multi 类型）
  groups?: MatrixGroup[] // 矩阵题分组（matrix_radio 类型）
  subTitles?: SubTitle[] | null // 矩阵题子标题
}

// export interface SurveyDataItem {
//   id: string
//   title: string | null
//   info: string | null
//   answers: Answer[]
//   collectTime: string // ISO 时间格式字符串
//   surveyId: string
//   files?: null
// }
// export type SurveyData = SurveyDataItem[]
export interface EditQuestionnaireData {
  id: string
  title: string | null
  info: string | null
  answers: Answer[]
  collectTime: string
  surveyId: string
  files?: null
}
