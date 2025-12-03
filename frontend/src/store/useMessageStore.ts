import { create } from 'zustand'

type Message = {
  id: number
  chatId: number
  authorId: number
  text: string
  createdAt: string
  tempId?: string
}

type MessageState = {
  byChatId: Record<number, Message[]>
}

type MessageActions = {
  setMessages: (chatId: number, messages: Message[]) => void
  addMessage: (chatId: number, message: Message) => void
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
}))
