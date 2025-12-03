// Строгие типы событий WebSocket по API_CONTRACT.md
export type ClientEvent =
  | {
      type: 'send_message'
      temp_id: string
      conversation_id: number
      text: string
      attachments: WSAttachmentInput[]
    }
  | { type: 'typing_start'; conversation_id: number }
  | { type: 'typing_stop'; conversation_id: number }

export type ServerEvent =
  | {
      type: 'message_sent'
      temp_id: string
      message: {
        id: number
        chat_id: number
        sender_id: number
        text: string
        created_at: string
        attachments?: WSAttachment[]
      }
    }
  | {
      type: 'new_message'
      conversation_id: number
      message: {
        id: number
        chat_id: number
        sender_id: number
        text: string
        created_at: string
        attachments?: WSAttachment[]
      }
    }
  | { type: 'typing'; conversation_id: number; user_id: number; is_typing: boolean }
  | { type: 'delivered'; message_id: number }
  | { type: 'read'; message_id: number }
  | { type: 'online_status'; user_id: number; online: boolean }

export type WSAttachment = {
  object_key: string
  file_name: string
  content_type: string
  size_bytes?: number | null
  url?: string
}

export type WSAttachmentInput = {
  object_key: string
  file_name: string
  content_type: string
  size_bytes?: number | null
}
