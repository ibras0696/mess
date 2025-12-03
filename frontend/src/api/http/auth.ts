import { appConfig } from '../../config'
import { createHttpClient } from './client'

const client = createHttpClient({ baseUrl: appConfig.apiUrl })

export type User = {
  id: number
  email: string
  username: string
  created_at: string
}

export type TokenPair = {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export type AccessToken = {
  access_token: string
  token_type: string
}

export type RegisterRequest = {
  email: string
  password: string
  username: string
}

export type LoginRequest = {
  email: string
  password: string
}

export const authApi = {
  register: (payload: RegisterRequest) => client.post<TokenPair, RegisterRequest>('/auth/register', payload),
  login: (payload: LoginRequest) => client.post<TokenPair, LoginRequest>('/auth/login', payload),
  refresh: (refresh_token: string) => client.post<AccessToken, { refresh_token: string }>('/auth/refresh', { refresh_token }),
  me: (accessToken: string) => client.get<User>('/users/me', { accessToken }),
}
