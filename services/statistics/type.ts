// export interface questions {
//   id: string
//   info: string | null
//   required: boolean
//   text: string | null
//   title: string
//   type: string
// }
export interface getFinllInByIdResPon {
  createTime: []
  deleteTime: string | null
  files: string | null
  id: string
  info: string
  questions: Question[]
  status: number
  title: string
  totalCollected: number
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
export interface GetAllFinllInResponse {
  data: SurveyDataItem[]
  totalData: number
  totalPage: number
}

// getFinllInById 的响应类型
// export interface GetFinllInByIdResponse {
//   createTime: number[]
//   deleteTime: string | null
//   files: string[] | null
//   id: string
//   info: string
//   questions: Question[]
//   status: number
//   title: string
//   totalCollected: number
// }

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
  id: string
  type:
    | 'text'
    | 'single'
    | 'multi'
    | 'matrix_radio'
    | 'textarea'
    | 'select'
    | 'description'
  title: string | null
  info: string | null
  required: boolean
  text?: string // 文本类答案（text/textarea 类型）
  options?: Option[] // 单选题/多选题选项（single/multi 类型）
  groups?: MatrixGroup[] // 矩阵题分组（matrix_radio 类型）
  subTitles?: SubTitle[] | null // 矩阵题子标题
}

export interface SurveyDataItem {
  id: string
  title: string | null
  info: string | null
  answers: Answer[]
  collectTime: string // ISO 时间格式字符串
  surveyId: string
  files?: null
}
export type SurveyData = SurveyDataItem[]
export interface EditQuestionnaireData {
  id: string
  title: string | null
  info: string | null
  answers: Answer[]
  collectTime: string
  surveyId: string
  files?: null
}
