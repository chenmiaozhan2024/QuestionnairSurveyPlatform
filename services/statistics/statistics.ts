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
  return request<GetAllFinllInResponse>(
    `${statisticAPI.getFillIn}?page=${params.page}&size=${params.size}&id=${params.id}`,
  )
}
export function getFinllInById(id: string) {
  return request<getFinllInByIdResPon>(`${statisticAPI.getQuestionnair}/${id}`)
}
// 根据id删除答卷
export function deleteQuestionnaireAnswer(id: string) {
  return request<void>(`${statisticAPI.deleteQuestionnaireAnswer}?id=${id}`, {
    method: 'DELETE',
  })
}
// 根据id编辑答卷
export function editQuestionnaireAnswer(data: EditQuestionnaireData) {
  return request<void>(`${statisticAPI.editQuestionnaireAnswer}`, {
    method: 'POST',
    body: data,
  })
}
