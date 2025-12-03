import { create } from 'zustand'

type Chat = {
  id: number
  title: string
  type: 'dialog' | 'group'
  unread: number
}

type ChatState = {
  chats: Chat[]
  activeChatId: number | null
}

type ChatActions = {
  setChats: (chats: Chat[]) => void
  setActiveChat: (chatId: number | null) => void
}

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  chats: [],
  activeChatId: null,
  setChats: (chats) => set({ chats }),
  setActiveChat: (chatId) => set({ activeChatId: chatId }),
}))
