export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
  }
}

export type ApiClientConfig = {
  baseUrl: string
  /**
   * Optional getter for Authorization header.
   */
  getAccessToken?: () => string | null | undefined
}

type RequestOptions = {
  accessToken?: string | null
}

export const createHttpClient = ({ baseUrl, getAccessToken }: ApiClientConfig) => {
  const apiBase = baseUrl.replace(/\/$/, '')

  const request = async <T>(path: string, init?: RequestInit, options?: RequestOptions): Promise<T> => {
    const headers = new Headers(init?.headers ?? {})
    headers.set('Content-Type', 'application/json')

    const token = options?.accessToken ?? getAccessToken?.()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${apiBase}${path}`, { ...init, headers })

    if (!response.ok) {
      let body: unknown
      try {
        body = await response.json()
      } catch {
        body = await response.text()
      }
      throw new ApiError(response.status, 'Request failed', body)
    }

    if (response.status === 204) {
      return null as T
    }

    return (await response.json()) as T
  }

  return {
    get: <T>(path: string, options?: RequestOptions) => request<T>(path, { method: 'GET' }, options),
    post: <T, B = unknown>(path: string, body: B, options?: RequestOptions) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(body) }, options),
  }
}
