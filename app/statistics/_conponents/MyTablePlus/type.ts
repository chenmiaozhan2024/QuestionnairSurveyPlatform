import { FinllInItem, Question } from '@/services/statistics/type'
export interface MyTablePlusProps {
  title?: string
  createTime?: string
  questions?: Question[]
  total?: number
  answers?: FinllInItem[]
  current?: number
  pageSize?: number
  onPageChange?: (page: number, size: number) => void
}
