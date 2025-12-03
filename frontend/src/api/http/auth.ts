import { appConfig } from '../../config'
import { createHttpClient } from './client'

const client = createHttpClient({ baseUrl: appConfig.apiUrl })

export type RegisterRequest = {
  email: string
  password: string
  username: string
}

export type RegisterResponse = {
  id: number
  email: string
  username: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  access_token: string
  refresh_token: string
  user: {
    id: number
    email: string
    username: string
  }
}

export const authApi = {
  register: (payload: RegisterRequest) =>
    client.post<RegisterResponse, RegisterRequest>('/auth/register', payload),
  login: (payload: LoginRequest) => client.post<LoginResponse, LoginRequest>('/auth/login', payload),
  refresh: (refresh_token: string) =>
    client.post<{ access_token: string }, { refresh_token: string }>('/auth/refresh', { refresh_token }),
  me: (accessToken: string) => client.get<{ id: number; email: string; username: string }>('/users/me', { accessToken }),
}
