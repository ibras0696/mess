import { createWSManager } from './ws_manager'
import type { ClientEvent, ServerEvent } from './ws_events'

export type WSClient = {
  send: (payload: ClientEvent) => void
  close: () => void
}

type WSClientOptions = {
  onOpen?: () => void
  onClose?: () => void
}

export const createWSClient = (
  url: string,
  token: string,
  onMessage: (event: ServerEvent) => void,
  options?: WSClientOptions,
): WSClient => {
  const manager = createWSManager({ url, token, onMessage, onOpen: options?.onOpen, onClose: options?.onClose })

  return {
    send: (payload) => manager.send(payload),
    close: () => manager.close(),
  }
}
