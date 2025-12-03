import { useCallback, useEffect } from 'react'
import { createWSClient } from '../api/ws/ws_client'
import type { ClientEvent, ServerEvent } from '../api/ws/ws_events'
import { appConfig } from '../config'
import { useAuthStore } from '../store/useAuthStore'
import { useMessageStore } from '../store/useMessageStore'
import { useWSStore } from '../store/useWSStore'

export const useRealtimeWs = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const setConnected = useWSStore((state) => state.setConnected)
  const setLastEventAt = useWSStore((state) => state.setLastEventAt)
  const setSender = useWSStore((state) => state.setSender)
  const setTyping = useWSStore((state) => state.setTyping)
  const addMessage = useMessageStore((state) => state.addMessage)
  const replaceTemp = useMessageStore((state) => state.replaceTemp)
  const markDelivered = useMessageStore((state) => state.markDelivered)
  const markRead = useMessageStore((state) => state.markRead)

  const handleMessage = useCallback(
    (event: ServerEvent) => {
      setLastEventAt(new Date().toISOString())

      if (event.type === 'message_sent') {
        const msg = event.message
        replaceTemp(msg.chat_id, event.temp_id, {
          id: msg.id,
          chatId: msg.chat_id,
          authorId: msg.sender_id,
          text: msg.text,
          createdAt: msg.created_at,
          attachments: msg.attachments?.map((a) => ({
            id: a.id,
            objectKey: a.object_key,
            fileName: a.file_name,
            contentType: a.content_type,
            sizeBytes: a.size_bytes ?? null,
            url: a.url,
          })),
        })
      }

      if (event.type === 'new_message') {
        const msg = event.message
        addMessage(msg.chat_id, {
          id: msg.id,
          chatId: msg.chat_id,
          authorId: msg.sender_id,
          text: msg.text,
          createdAt: msg.created_at,
          attachments: msg.attachments?.map((a) => ({
            id: a.id,
            objectKey: a.object_key,
            fileName: a.file_name,
            contentType: a.content_type,
            sizeBytes: a.size_bytes ?? null,
            url: a.url,
          })),
        })
      }

      if (event.type === 'typing') {
        setTyping(event.conversation_id, event.user_id, event.is_typing)
      }

      if (event.type === 'delivered') {
        markDelivered(event.message_id, event.user_id)
      }

      if (event.type === 'read') {
        markRead(event.message_id, event.user_id)
      }
    },
    [addMessage, markDelivered, markRead, replaceTemp, setLastEventAt, setTyping],
  )

  useEffect(() => {
    if (!accessToken) return
    const client = createWSClient(appConfig.wsUrl, accessToken, handleMessage, {
      onOpen: () => setConnected(true),
      onClose: () => setConnected(false),
    })
    setSender(() => (payload: ClientEvent) => client.send(payload))

    return () => {
      client.close()
      setSender(undefined)
      setConnected(false)
    }
  }, [accessToken, handleMessage, setConnected, setSender])

  const sendMessage = (payload: ClientEvent) => {
    const sender = useWSStore.getState().send
    sender?.(payload)
  }

  return { sendMessage, user }
}
