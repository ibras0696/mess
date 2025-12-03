import { useEffect, useRef } from 'react'
import { createWSClient, type WSClient } from '../api/ws/ws_client'
import { useWSStore } from '../store/useWSStore'

type UseWebSocketParams = {
  url: string
  token: string
}

export const useWebSocket = ({ url, token }: UseWebSocketParams) => {
  const clientRef = useRef<WSClient | null>(null)
  const setConnected = useWSStore((state) => state.setConnected)
  const setLastEventAt = useWSStore((state) => state.setLastEventAt)

  useEffect(() => {
    clientRef.current = createWSClient(url, token, () => {
      setConnected(true)
      setLastEventAt(new Date().toISOString())
    })

    return () => {
      clientRef.current?.close()
      setConnected(false)
    }
  }, [setConnected, setLastEventAt, token, url])

  const send = (payload: Parameters<WSClient['send']>[0]) => clientRef.current?.send(payload)

  return { send }
}
