import { createWSManager } from './ws_manager'
import type { ClientEvent, ServerEvent } from './ws_events'

export type WSClient = {
  send: (payload: ClientEvent) => void
  close: () => void
}

export const createWSClient = (url: string, token: string, onMessage: (event: ServerEvent) => void): WSClient => {
  const manager = createWSManager({ url, token, onMessage })

  return {
    send: (payload) => manager.send(payload),
    close: () => manager.close(),
  }
}
