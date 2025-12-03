import { create } from 'zustand'

type Message = {
  id: number
  chatId: number
  authorId: number
  text: string
  createdAt: string
  tempId?: string
  attachments?: Attachment[]
  deliveredBy?: number[]
  readBy?: number[]
}

type Attachment = {
  objectKey: string
  fileName: string
  contentType: string
  sizeBytes?: number | null
  url?: string
  id?: number
}

type MessageState = {
  byChatId: Record<number, Message[]>
}

type MessageActions = {
  setMessages: (chatId: number, messages: Message[]) => void
  addMessage: (chatId: number, message: Message) => void
  replaceTemp: (chatId: number, tempId: string, message: Message) => void
  markDelivered: (messageId: number, userId: number) => void
  markRead: (messageId: number, userId: number) => void
}

export const useMessageStore = create<MessageState & MessageActions>((set) => ({
  byChatId: {},
  setMessages: (chatId, messages) =>
    set((state) => ({ byChatId: { ...state.byChatId, [chatId]: messages } })),
  addMessage: (chatId, message) =>
    set((state) => {
      const existing = state.byChatId[chatId] ?? []
      return { byChatId: { ...state.byChatId, [chatId]: [...existing, message] } }
    }),
  replaceTemp: (chatId, tempId, message) =>
    set((state) => {
      const existing = state.byChatId[chatId] ?? []
      const updated = existing.map((m) => (m.tempId === tempId ? message : m))
      return { byChatId: { ...state.byChatId, [chatId]: updated } }
    }),
  markDelivered: (messageId, userId) =>
    set((state) => {
      const next = { ...state.byChatId }
      Object.entries(next).forEach(([chatKey, list]) => {
        next[Number(chatKey)] = list.map((m) =>
          m.id === messageId
            ? { ...m, deliveredBy: Array.from(new Set([...(m.deliveredBy ?? []), userId])) }
            : m,
        )
      })
      return { byChatId: next }
    }),
  markRead: (messageId, userId) =>
    set((state) => {
      const next = { ...state.byChatId }
      Object.entries(next).forEach(([chatKey, list]) => {
        next[Number(chatKey)] = list.map((m) =>
          m.id === messageId ? { ...m, readBy: Array.from(new Set([...(m.readBy ?? []), userId])) } : m,
        )
      })
      return { byChatId: next }
    }),
}))
