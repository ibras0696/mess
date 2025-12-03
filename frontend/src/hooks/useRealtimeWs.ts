import { useEffect, useMemo, useRef } from 'react'
import { createWSClient } from '../api/ws/ws_client'
import type { ClientEvent, ServerEvent } from '../api/ws/ws_events'
import { appConfig } from '../config'
import { useAuthStore } from '../store/useAuthStore'
import { useMessageStore } from '../store/useMessageStore'
import { useWSStore } from '../store/useWSStore'
import { debugLog } from '../utils/debugLog'

export const useRealtimeWs = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const authReady = useAuthStore((state) => state.authReady)
  const setConnected = useWSStore((state) => state.setConnected)
  const setLastEventAt = useWSStore((state) => state.setLastEventAt)
  const setSender = useWSStore((state) => state.setSender)
  const setTyping = useWSStore((state) => state.setTyping)
  const addMessage = useMessageStore((state) => state.addMessage)
  const replaceTemp = useMessageStore((state) => state.replaceTemp)

  const clientRef = useRef<ReturnType<typeof createWSClient> | null>(null)
  const prevTokenRef = useRef<string | null>(null)
  const senderSetRef = useRef(false)
  const connectedRef = useRef(false)

  // Держим обработчик в ref, чтобы эффект создания сокета не пересоздавался
  const handlerRef = useRef<(event: ServerEvent) => void>()
  handlerRef.current = (event: ServerEvent) => {
    setLastEventAt(new Date().toISOString())
    debugLog(`ws:event:${event.type}`, event)

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
  }

  // Мемоизированный sender, чтобы не пересоздавать функцию и не гонять setSender
  const senderFn = useMemo(() => {
    return (payload: ClientEvent) => {
      const sender = useWSStore.getState().send
      sender?.(payload)
    }
  }, [])

  useEffect(() => {
    // Пока авторизация не готова — не трогаем стор/WS, просто ждём
    if (!authReady) {
      debugLog('ws:wait_auth')
      return
    }

    // Если авторизация готова, но токена нет — закрываем клиент и чистим стор один раз
    if (!accessToken) {
      debugLog('ws:no_token_close')
      if (clientRef.current) {
        clientRef.current.close()
        clientRef.current = null
      }
      if (senderSetRef.current) {
        setSender(undefined)
        senderSetRef.current = false
      }
      if (connectedRef.current) {
        setConnected(false)
        connectedRef.current = false
      }
      prevTokenRef.current = null
      return
    }

    // Если токен не поменялся и клиент жив — ничего не делаем
    if (prevTokenRef.current === accessToken && clientRef.current) {
      debugLog('ws:reuse_client')
      return
    }

    // Токен новый или клиента нет — пересоздаём
    if (clientRef.current) {
      debugLog('ws:close_old')
      clientRef.current.close()
      clientRef.current = null
    }

    debugLog('ws:create_client', { tokenSet: Boolean(accessToken) })
    const client = createWSClient(appConfig.wsUrl, accessToken, (event) => handlerRef.current?.(event), {
      onOpen: () => {
        if (!connectedRef.current) {
          setConnected(true)
          connectedRef.current = true
          debugLog('ws:on_open')
        }
      },
      onClose: () => {
        if (connectedRef.current) {
          setConnected(false)
          connectedRef.current = false
          debugLog('ws:on_close')
        }
      },
    })
    clientRef.current = client
    prevTokenRef.current = accessToken

    const sendWrapper = (payload: ClientEvent) => client.send(payload)
    if (!senderSetRef.current || useWSStore.getState().send !== sendWrapper) {
      setSender(() => sendWrapper)
      senderSetRef.current = true
      debugLog('ws:set_sender')
    }

    return () => {
      debugLog('ws:effect_cleanup')
      clientRef.current?.close()
      clientRef.current = null
      prevTokenRef.current = null

      if (senderSetRef.current) {
        setSender(undefined)
        senderSetRef.current = false
      }
      if (connectedRef.current) {
        setConnected(false)
        connectedRef.current = false
      }
    }
    // setConnected/setSender стабильны в zustand, добавляем для читабельности зависимостей
  }, [accessToken, authReady, setConnected, setSender])

  const sendMessage = senderFn

  return { sendMessage, user }
}
