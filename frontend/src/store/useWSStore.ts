import { create } from 'zustand'
import type { ClientEvent } from '../api/ws/ws_events'

type WSState = {
  connected: boolean
  lastEventAt: string | null
  send?: (payload: ClientEvent) => void
  typingByChat: Record<number, number[]>
}

type WSActions = {
  setConnected: (connected: boolean) => void
  setLastEventAt: (iso: string) => void
  setSender: (sender: WSState['send']) => void
  setTyping: (chatId: number, userId: number, isTyping: boolean) => void
}

export const useWSStore = create<WSState & WSActions>((set) => ({
  connected: false,
  lastEventAt: null,
  send: undefined,
  typingByChat: {},
  setConnected: (connected) => set({ connected }),
  setLastEventAt: (iso) => set({ lastEventAt: iso }),
  setSender: (sender) => set({ send: sender }),
  setTyping: (chatId, userId, isTyping) =>
    set((state) => {
      const current = state.typingByChat[chatId] ?? []
      const next = isTyping ? Array.from(new Set([...current, userId])) : current.filter((id) => id !== userId)
      return { typingByChat: { ...state.typingByChat, [chatId]: next } }
    }),
}))
