import { create } from 'zustand'

type WSState = {
  connected: boolean
  lastEventAt: string | null
}

type WSActions = {
  setConnected: (connected: boolean) => void
  setLastEventAt: (iso: string) => void
}

export const useWSStore = create<WSState & WSActions>((set) => ({
  connected: false,
  lastEventAt: null,
  setConnected: (connected) => set({ connected }),
  setLastEventAt: (iso) => set({ lastEventAt: iso }),
}))
