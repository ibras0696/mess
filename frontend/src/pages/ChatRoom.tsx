import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ResponseError } from '../api/generated/runtime'
import { useApiClients } from '../hooks/useApiClients'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import { useMessageStore } from '../store/useMessageStore'
import { useWSStore } from '../store/useWSStore'
import { formatTime } from '../utils/formatting'
import { FileUploader, type UploadedAttachment } from '../components/FileUploader/FileUploader'

export const ChatRoomPage = () => {
  const { chatId: chatIdParam } = useParams()
  const chatId = chatIdParam ? Number(chatIdParam) : null
  const validChatId = chatId !== null && !Number.isNaN(chatId) ? chatId : null
  const { chatsApi } = useApiClients()
  const accessToken = useAuthStore((state) => state.accessToken)
  const authReady = useAuthStore((state) => state.authReady)
  const currentUser = useAuthStore((state) => state.user)
  const chat = useChatStore((state) => state.chats.find((c) => c.id === validChatId))
  const setMessages = useMessageStore((state) => state.setMessages)
  const addMessage = useMessageStore((state) => state.addMessage)
  const messages = useMessageStore((state) => (validChatId ? state.byChatId[validChatId] ?? [] : []))
  const sendWs = useWSStore((state) => state.send)
  const typingByChat = useWSStore((state) => state.typingByChat)
  const connected = useWSStore((state) => state.connected)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([])

  const canSend = useMemo(() => Boolean(text.trim()), [text])
  const typingUsers = validChatId ? typingByChat[validChatId] ?? [] : []
  const [isTypingSelf, setIsTypingSelf] = useState(false)

  useEffect(() => {
    if (!authReady || !accessToken || !validChatId) return
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const list = await chatsApi.listMessagesApiChatsChatIdMessagesGet({ chatId: validChatId, limit: 50 })
        const mapped = list.map((m) => ({
          id: m.id,
          chatId: m.chatId,
          authorId: m.senderId,
          text: m.text,
          createdAt: m.createdAt.toISOString(),
          attachments:
            m.attachments?.map((att) => ({
              id: att.id,
              objectKey: att.objectKey,
              fileName: att.fileName,
              contentType: att.contentType,
              sizeBytes: att.sizeBytes ?? null,
              url: att.url ?? undefined,
            })) ?? [],
        }))
        setMessages(validChatId, mapped)
      } catch {
        setError('Не удалось загрузить сообщения. Проверьте API.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [accessToken, authReady, chatsApi, setMessages, validChatId])

  const handleSend = async () => {
    if (!validChatId || !currentUser) return
    if (attachments.length && (!sendWs || !connected)) {
      setError('Вложения отправляются по WebSocket, подключитесь к WS.')
      return
    }
    if (!canSend) {
      setError('Введите текст сообщения.')
      return
    }
    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tmp-${Date.now()}`

    if (sendWs && connected) {
      addMessage(validChatId, {
        id: -1,
        chatId: validChatId,
        authorId: currentUser.id,
        text,
        createdAt: new Date().toISOString(),
        tempId,
        attachments: attachments.map((a) => ({
          objectKey: a.objectKey,
          fileName: a.fileName,
          contentType: a.contentType,
          sizeBytes: a.sizeBytes,
          url: a.url,
        })),
      })
      sendWs({
        type: 'send_message',
        temp_id: tempId,
        conversation_id: validChatId,
        text,
        attachments: attachments.map((a) => ({
          object_key: a.objectKey,
          file_name: a.fileName,
          content_type: a.contentType,
          size_bytes: a.sizeBytes ?? undefined,
        })),
      })
      setText('')
      setAttachments([])
      return
    }

    try {
      const sent = await chatsApi.sendMessageApiChatsChatIdMessagesPost({
        chatId: validChatId,
        sendMessageRequest: {
          text,
          attachments: attachments.map((a) => ({
            objectKey: a.objectKey,
            fileName: a.fileName,
            contentType: a.contentType,
            sizeBytes: a.sizeBytes ?? null,
            url: a.url ?? null,
          })),
        },
      })
      addMessage(validChatId, {
        id: sent.id,
        chatId: sent.chatId,
        authorId: sent.senderId,
        text: sent.text,
        createdAt: sent.createdAt.toISOString(),
        attachments:
          sent.attachments?.map((att) => ({
            id: att.id,
            objectKey: att.objectKey,
            fileName: att.fileName,
            contentType: att.contentType,
            sizeBytes: att.sizeBytes ?? null,
            url: att.url ?? undefined,
          })) ?? [],
      })
      setText('')
      setAttachments([])
    } catch (err) {
      if (err instanceof ResponseError && err.response.status === 429) {
        setError('Слишком часто отправляете сообщения (rate limit). Попробуйте позже.')
      } else {
        setError('Не удалось отправить сообщение. Проверьте API.')
      }
    }
  }

  const handleTyping = (isTyping: boolean) => {
    if (!validChatId || !sendWs || !connected) return
    sendWs({ type: isTyping ? 'typing_start' : 'typing_stop', conversation_id: validChatId })
    setIsTypingSelf(isTyping)
  }

  if (!validChatId) {
    return (
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white">Некорректный чат</h2>
        <p className="mt-2 text-sm text-slate-300">Укажите корректный идентификатор чата.</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Диалог</p>
          <h2 className="text-xl font-semibold text-white">
            {chat ? chat.title : `Чат ${chatId ?? ''}`}
          </h2>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">REST</span>
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">История сообщений</p>
            <span className="text-xs text-slate-400">{loading ? 'Загрузка...' : `${messages.length} шт.`}</span>
          </div>
          <div className="mt-3 space-y-2">
            {messages.map((msg) => {
              const isMine = currentUser && msg.authorId === currentUser.id
              const deliveredCount = msg.deliveredBy?.length ?? 0
              const readCount = msg.readBy?.length ?? 0

              return (
                <article
                  key={msg.id !== -1 ? msg.id : msg.tempId ?? `${msg.id}-${msg.text}`}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{isMine ? 'Вы' : `User ${msg.authorId}`}</p>
                    <span className="text-xs text-slate-400">{formatTime(msg.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-200">{msg.text}</p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.attachments.map((att) => (
                        <div key={att.objectKey} className="text-xs text-sky-200">
                          📎 {att.fileName} ({att.contentType})
                        </div>
                      ))}
                    </div>
                  )}
                  {isMine && (deliveredCount > 0 || readCount > 0) && (
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
                      {deliveredCount > 0 && <span>✓ delivered: {deliveredCount}</span>}
                      {readCount > 0 && <span>✓✓ read: {readCount}</span>}
                    </div>
                  )}
                </article>
              )
            })}
            {!messages.length && <p className="text-sm text-slate-400">Нет сообщений</p>}
            {typingUsers.length > 0 && (
              <p className="text-xs text-slate-400">
                typing: {typingUsers.map((id) => `User ${id}`).join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Отправка сообщения</p>
          <div className="flex flex-wrap items-center gap-2">
            {attachments.map((att) => (
              <span
                key={att.objectKey}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-sky-100"
              >
                {att.fileName}
                <button
                  type="button"
                  className="text-slate-300 hover:text-white"
                  onClick={() =>
                    setAttachments((prev) => prev.filter((a) => a.objectKey !== att.objectKey))
                  }
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <FileUploader
            onAttached={(att) => setAttachments((prev) => [...prev, att])}
            disabled={!chatId}
          />
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none"
            placeholder="Текст сообщения"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              handleTyping(true)
            }}
            onBlur={() => handleTyping(false)}
          />
          <button
            type="button"
            className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-900 shadow-lg shadow-emerald-400/30 transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSend}
            disabled={!canSend}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  )
}
