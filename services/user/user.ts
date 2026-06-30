import { request } from '@/lib/request'

interface LoginParams {
  username: string
  password: string
}

interface LoginData {
  msg: string
  userRole: string
  accessToken: string
  refreshToken: string
}

interface LoginResult {
  code: number
  msg: string
  data: LoginData
}
const UserAPI = {
  loginAPi: '/api/user/login',
}

export const reqLogin = (body: LoginParams) =>
  request.post<LoginResult>(UserAPI.loginAPi, body)
