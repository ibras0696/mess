import { Configuration, AuthApi, UsersApi, type TokenPair, type AccessToken, type UserRead } from '../generated'
import { appConfig } from '../../config'

const baseConfig = new Configuration({ basePath: appConfig.apiBaseUrl })

const buildAuthApi = (accessToken?: string | null) =>
  new AuthApi(
    new Configuration({
      basePath: appConfig.apiBaseUrl,
      accessToken: accessToken ? () => accessToken : undefined,
    }),
  )

const buildUsersApi = (accessToken?: string | null) =>
  new UsersApi(
    new Configuration({
      basePath: appConfig.apiBaseUrl,
      accessToken: accessToken ? () => accessToken : undefined,
    }),
  )

export type RegisterRequest = {
  email: string
  password: string
  username: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type User = UserRead

export type { TokenPair, AccessToken }

export const authApi = {
  register: (payload: RegisterRequest) => buildAuthApi().registerApiAuthRegisterPost({ userCreate: payload }),
  login: (payload: LoginRequest) => buildAuthApi().loginApiAuthLoginPost({ loginRequest: payload }),
  refresh: (refresh_token: string) =>
    new AuthApi(baseConfig).refreshApiAuthRefreshPost({ refreshRequest: { refreshToken: refresh_token } }),
  me: (accessToken: string) => buildUsersApi(accessToken).getMeApiUsersMeGet(),
}
