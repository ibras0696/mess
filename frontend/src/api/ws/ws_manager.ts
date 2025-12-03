import type { ClientEvent, ServerEvent } from './ws_events'

type WSManagerConfig = {
  url: string
  token: string
  onMessage: (event: ServerEvent) => void
  onOpen?: () => void
  onClose?: () => void
  reconnectDelayMs?: number
}

export const createWSManager = ({
  url,
  token,
  onMessage,
  onOpen,
  onClose,
  reconnectDelayMs = 2000,
}: WSManagerConfig) => {
  let socket: WebSocket | null = null
  let shouldReconnect = true

  const connect = () => {
    socket = new WebSocket(`${url}?token=${token}`)

    socket.onopen = () => {
      onOpen?.()
    }

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as ServerEvent
        onMessage(parsed)
      } catch (err) {
        console.warn('WS parse error', err)
      }
    }

    socket.onclose = () => {
      onClose?.()
      if (shouldReconnect) {
        setTimeout(connect, reconnectDelayMs)
      }
    }

    socket.onerror = () => {
      socket?.close()
    }
  }

  connect()

  const send = (payload: ClientEvent) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify(payload))
  }

  const close = () => {
    shouldReconnect = false
    socket?.close()
  }

  return { send, close }
}
