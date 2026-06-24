// lib/request.ts

type RequestOptions = {
  method?: string
  headers?: Record<string, string>
  body?: object | FormData
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

/** 后端统一响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

/**
 * 封装的请求函数，自动：
 * - 注入 token
 * - 检查业务 code（非 200 抛错）
 * - 解包 data 返回
 */
export async function request<T = unknown>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { token }),
    ...(options.headers as Record<string, string>),
  }

  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined,
  })

  const json: ApiResponse<T> = await res.json().catch(() => {
    throw new Error('响应格式错误')
  })

  // 业务层错误（后端 code 不为 1 表示失败）
  if (json.code !== 1) {
    throw new Error(json.msg || '请求失败')
  }

  return json.data
}
