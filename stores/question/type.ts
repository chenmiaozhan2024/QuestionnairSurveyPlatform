export interface SurveyQuestion {
  order?: string
  type?: string
  title?: string
  info?: string
  required?: boolean
  subTitles?: string[]
  options?: string[]
  id?: string
}
export interface SurveyState {
  title: string
  info: string
  questions: SurveyQuestion[]
  // actions 直接写在 store 里
  setTitle: (title: string) => void
  setInfo: (info: string) => void
  addQuestion: (question: SurveyQuestion) => void
  removeQuestion: (index: number) => void
  updateQuestion: (id: string, updates: Partial<SurveyQuestion>) => void
  resetSurvey: () => void
  setQuestions: (questions: SurveyQuestion[]) => void
}
