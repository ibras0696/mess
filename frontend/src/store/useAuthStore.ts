import { create } from 'zustand'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: { id: number; email: string; username: string } | null
}

type AuthActions = {
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: AuthState['user']) => void
  reset: () => void
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  setUser: (user) => set({ user }),
  reset: () => set(initialState),
}))
