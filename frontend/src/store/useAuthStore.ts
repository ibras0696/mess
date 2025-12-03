import { create } from 'zustand'
import { tokenStorage } from '../utils/token'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: { id: number; email: string; username: string } | null
}

type AuthActions = {
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: AuthState['user']) => void
  reset: () => void
  hydrate: () => void
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,
  setTokens: (accessToken, refreshToken) => {
    tokenStorage.save(accessToken, refreshToken)
    set({ accessToken, refreshToken })
  },
  setUser: (user) => set({ user }),
  reset: () => {
    tokenStorage.clear()
    set(initialState)
  },
  hydrate: () => {
    const { access, refresh } = tokenStorage.load()
    set({ accessToken: access, refreshToken: refresh })
  },
}))
