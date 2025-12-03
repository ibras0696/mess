import { useEffect, useMemo, useState } from 'react'
import { appConfig } from '../config'
import { useApiClients } from './useApiClients'
import { useAuthStore } from '../store/useAuthStore'
import { AuthApi, UsersApi, Configuration } from '../api/generated'

export const useAuthBootstrap = () => {
  const {
    accessToken,
    refreshToken,
    user,
    setTokens,
    setUser,
    setTokenType,
    reset,
    hydrate,
    setAuthReady,
    authReady,
  } = useAuthStore()
  const { usersApi } = useApiClients()
  const authApiNoToken = useMemo(() => new AuthApi(new Configuration({ basePath: appConfig.apiBaseUrl })), [])
  const usersApiNoToken = useMemo(() => new UsersApi(new Configuration({ basePath: appConfig.apiBaseUrl })), [])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    let canceled = false

    if (authReady) return

    const init = async () => {
      try {
        let token = accessToken
        if (!token && refreshToken) {
          const refreshed = await authApiNoToken.refreshApiAuthRefreshPost({
            refreshRequest: { refreshToken },
          })
          setTokens(refreshed.accessToken, refreshToken)
          setTokenType(refreshed.tokenType ?? 'bearer')
          token = refreshed.accessToken
        }

        if (token && !user) {
          const me = await (token ? usersApi.getMeApiUsersMeGet() : usersApiNoToken.getMeApiUsersMeGet())
          setUser(me)
        }
      } catch {
        reset()
      } finally {
        if (!canceled) {
          setAuthReady(true)
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      canceled = true
    }
  }, [
    accessToken,
    refreshToken,
    user,
    authReady,
    reset,
    setAuthReady,
    setTokenType,
    setTokens,
    setUser,
    usersApi,
    usersApiNoToken,
    authApiNoToken,
  ])

  return { authReady, loading }
}
