import { request } from '@/lib/request'

interface LoginParams {
  username: string
  password: string
}
interface LoginResult {
  msg: string
  userRole: string
  token: string
}
const UserAPI = {
  loginAPi: '/api/user/login',
}

export const reqLogin = (body: LoginParams) =>
  request<LoginResult>(UserAPI.loginAPi, {
    method: 'POST',
    body,
  })
