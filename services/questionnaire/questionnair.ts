import { request } from '@/lib/request'
import { QuestionnaireResult } from './type'
const FILE_URLS = {
  status: '/api/questionnaire/status',
  list: '/api/questionnaire',
}
//获取问卷列表
export const reqGetQuestionnairList = (
  page: number,
  size: number,
  choice: string,
) => {
  return request.get<QuestionnaireResult>(
    `${FILE_URLS.list}?page=${page}&size=${size}&choice=${choice}`,
  )
}
// 修改问卷的状态
export const reqChangeStatus = (id: string, newStatus: number) => {
  return request.put(`${FILE_URLS.status}?id=${id}&newStatus=${newStatus}`)
}
