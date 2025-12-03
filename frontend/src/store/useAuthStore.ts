import { create } from 'zustand'
import type { User } from '../api/http/auth'
import { tokenStorage } from '../utils/token'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  tokenType: string | null
  user: User | null
}

type AuthActions = {
  setTokens: (accessToken: string, refreshToken: string) => void
  setTokenType: (tokenType: string) => void
  setUser: (user: AuthState['user']) => void
  reset: () => void
  hydrate: () => void
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  user: null,
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,
  setTokens: (accessToken, refreshToken) => {
    tokenStorage.save(accessToken, refreshToken)
    set({ accessToken, refreshToken, tokenType: 'bearer' })
  },
  setUser: (user) => set({ user }),
  setTokenType: (tokenType) => set({ tokenType }),
  reset: () => {
    tokenStorage.clear()
    set(initialState)
  },
  hydrate: () => {
    const { access, refresh } = tokenStorage.load()
    set({
      accessToken: access,
      refreshToken: refresh,
      tokenType: access ? 'bearer' : null,
    })
  },
}))
