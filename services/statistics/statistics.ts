import { request } from '@/lib/request'
import type {
  GetAllFinllInResponse,
  getFinllInByIdResPon,
  EditQuestionnaireData,
} from './type'
const statisticAPI = {
  getFillIn: '/api/questionnaire/getFillIn',
  getQuestionnair: '/api/questionnaire',
  deleteQuestionnaireAnswer: '/api/questionnaire/deleteFillIn',
  editQuestionnaireAnswer: '/api/questionnaire/updateFillIn',
}
// 获取所有答卷
export function getAllFinllIn({
  page = 1,
  size = 10,
  id,
}: {
  page?: number
  size?: number
  id: string
}) {
  const params = {
    page,
    size,
    id,
  }
  return request.get<GetAllFinllInResponse>(
    `${statisticAPI.getFillIn}?page=${params.page}&size=${params.size}&id=${params.id}`,
  )
}
// 根据id获取答卷详情，用于统计页面使用
export function getFinllInById(id: string) {
  return request.get<getFinllInByIdResPon>(`${statisticAPI.getFillIn}/${id}`)
}

// 根据id删除答卷
export function deleteQuestionnaireAnswer(id: string) {
  return request.delete<void>(
    `${statisticAPI.deleteQuestionnaireAnswer}?id=${id}`,
  )
}
// 根据id编辑答卷
export function editQuestionnaireAnswer(data: EditQuestionnaireData) {
  return request.post<void>(`${statisticAPI.editQuestionnaireAnswer}`)
}
//根据问卷id获取问卷里的问题
export function reqQuestions(id: string) {
  return request.get<getFinllInByIdResPon>(
    `${statisticAPI.getQuestionnair}/${id}`,
  )
}
