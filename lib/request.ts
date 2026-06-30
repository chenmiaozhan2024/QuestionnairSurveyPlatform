import axios, { type AxiosRequestConfig } from 'axios'

const instance = axios.create({
  baseURL: process.env.BACKEND_URL,
  withCredentials: true, // cookie 自动带上
})

// 包装一层，让 TS 知道拦截器已剥掉 AxiosResponse
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config) as any
  },
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return instance.post(url, data, config) as any
  },
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return instance.put(url, data, config) as any
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config) as any
  },
} as const

// 请求拦截器：每次请求带上 accessToken
instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 响应拦截器：无感刷新
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

instance.interceptors.response.use(
  (res) => res.data, // 直接返回后端数据，去掉 axios 包裹
  async (err) => {
    const { config, response } = err

    // 不是 401 或 _retry 标记过 → 直接抛出
    if (response?.status !== 401 || config._retry) {
      return Promise.reject(err)
    }

    // 防止并发刷新
    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((token: string) => {
          config.headers.Authorization = `Bearer ${token}`
          resolve(instance(config))
        })
      })
    }

    config._retry = true
    isRefreshing = true

    try {
      const res = await instance.post('/refresh')
      const newToken = res.data.accessToken
      localStorage.setItem('accessToken', newToken)

      // 重试积压的请求
      pendingRequests.forEach((cb) => cb(newToken))
      pendingRequests = []

      config.headers.Authorization = `Bearer ${newToken}`
      return instance(config)
    } catch {
      // refresh 也失败 → 清空状态，跳登录
      localStorage.removeItem('accessToken')
      pendingRequests = []
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  },
)

// export  request
