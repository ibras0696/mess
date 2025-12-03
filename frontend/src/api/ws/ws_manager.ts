import type { ClientEvent, ServerEvent } from './ws_events'

type WSManagerConfig = {
  url: string
  token: string
  onMessage: (event: ServerEvent) => void
}

export const createWSManager = ({ url, token, onMessage }: WSManagerConfig) => {
  const socket = new WebSocket(`${url}?token=${token}`)

  socket.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data) as ServerEvent
      onMessage(parsed)
    } catch (err) {
      console.warn('WS parse error', err)
    }
  }

  const send = (payload: ClientEvent) => {
    if (socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify(payload))
  }

  const close = () => socket.close()

  return { send, close }
}
