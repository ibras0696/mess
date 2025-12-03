// Строгие типы событий WebSocket по API_CONTRACT.md
export type ClientEvent =
  | {
      type: 'send_message'
      temp_id: string
      conversation_id: number
      text: string
      attachments: string[]
    }
  | { type: 'typing_start'; conversation_id: number }
  | { type: 'typing_stop'; conversation_id: number }

export type ServerEvent =
  | { type: 'message_sent'; temp_id: string; message: unknown }
  | { type: 'new_message'; conversation_id: number; message: unknown }
  | { type: 'typing'; conversation_id: number; user_id: number }
  | { type: 'delivered'; message_id: number }
  | { type: 'read'; message_id: number }
  | { type: 'online_status'; user_id: number; online: boolean }
