import { create } from 'zustand'
import type { User } from '../api/http/auth'
import { tokenStorage } from '../utils/token'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  tokenType: string | null
  user: User | null
  authReady: boolean
}

type AuthActions = {
  setTokens: (accessToken: string, refreshToken: string) => void
  setTokenType: (tokenType: string | null) => void
  setUser: (user: AuthState['user']) => void
  setAuthReady: (ready: boolean) => void
  reset: () => void
  hydrate: () => void
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  user: null,
  authReady: false,
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,
  setTokens: (accessToken, refreshToken) => {
    tokenStorage.save(accessToken, refreshToken)
    set({ accessToken, refreshToken, tokenType: 'bearer' })
  },
  setUser: (user) => set({ user }),
  setTokenType: (tokenType) => set({ tokenType }),
  setAuthReady: (ready) => set({ authReady: ready }),
  reset: () => {
    tokenStorage.clear()
    set({ ...initialState, authReady: true })
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
