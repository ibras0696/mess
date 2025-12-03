import { useEffect, useState } from 'react'
import { authApi } from '../api/http/auth'
import { useAuthStore } from '../store/useAuthStore'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    let canceled = false

    const init = async () => {
      try {
        let token = accessToken
        if (!token && refreshToken) {
          const refreshed = await authApi.refresh(refreshToken)
          setTokens(refreshed.access_token, refreshToken)
          setTokenType(refreshed.token_type)
          token = refreshed.access_token
        }

        if (token && !user) {
          const me = await authApi.me(token)
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
  }, [accessToken, refreshToken, reset, setAuthReady, setTokenType, setTokens, setUser, user])

  return { authReady, loading }
}
