import { create } from 'zustand'

type Message = {
  id: number
  chatId: number
  authorId: number
  text: string
  createdAt: string
  tempId?: string
  attachments?: Attachment[]
}

type Attachment = {
  objectKey: string
  fileName: string
  contentType: string
  sizeBytes?: number | null
  url?: string
}

type MessageState = {
  byChatId: Record<number, Message[]>
}

type MessageActions = {
  setMessages: (chatId: number, messages: Message[]) => void
  addMessage: (chatId: number, message: Message) => void
  replaceTemp: (chatId: number, tempId: string, message: Message) => void
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
}))
