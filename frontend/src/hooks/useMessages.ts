import { useCallback } from 'react'
import { useMessageStore } from '../store/useMessageStore'

export const useMessages = (chatId: number) => {
  const messages = useMessageStore((state) => state.byChatId[chatId] ?? [])
  const addMessage = useMessageStore((state) => state.addMessage)

  const append = useCallback(
    (payload: { id: number; authorId: number; text: string; createdAt: string; tempId?: string }) => {
      addMessage(chatId, { chatId, ...payload })
    },
    [addMessage, chatId],
  )

  return { messages, append }
}
