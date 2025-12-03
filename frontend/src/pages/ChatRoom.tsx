import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiClients } from '../hooks/useApiClients'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import { useMessageStore } from '../store/useMessageStore'
import { formatTime } from '../utils/formatting'

export const ChatRoomPage = () => {
  const { chatId: chatIdParam } = useParams()
  const chatId = chatIdParam ? Number(chatIdParam) : null
  const { chatsApi } = useApiClients()
  const accessToken = useAuthStore((state) => state.accessToken)
  const authReady = useAuthStore((state) => state.authReady)
  const chat = useChatStore((state) => state.chats.find((c) => c.id === chatId))
  const setMessages = useMessageStore((state) => state.setMessages)
  const addMessage = useMessageStore((state) => state.addMessage)
  const messages = useMessageStore((state) => (chatId ? state.byChatId[chatId] ?? [] : []))

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [text, setText] = useState('')

  const canSend = useMemo(() => Boolean(text.trim()), [text])

  useEffect(() => {
    if (!authReady || !accessToken || !chatId) return
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const list = await chatsApi.listMessagesApiChatsChatIdMessagesGet({ chatId, limit: 50 })
        const mapped = list.map((m) => ({
          id: m.id,
          chatId: m.chatId,
          authorId: m.senderId,
          text: m.text,
          createdAt: m.createdAt.toISOString(),
        }))
        setMessages(chatId, mapped)
      } catch {
        setError('Не удалось загрузить сообщения. Проверьте API.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [accessToken, authReady, chatId, chatsApi, setMessages])

  const handleSend = async () => {
    if (!chatId || !canSend) return
    try {
      const sent = await chatsApi.sendMessageApiChatsChatIdMessagesPost({
        chatId,
        sendMessageRequest: { text },
      })
      addMessage(chatId, {
        id: sent.id,
        chatId: sent.chatId,
        authorId: sent.senderId,
        text: sent.text,
        createdAt: sent.createdAt.toISOString(),
      })
      setText('')
    } catch {
      setError('Не удалось отправить сообщение. Проверьте API.')
    }
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
            {messages.map((msg) => (
              <article key={msg.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">User {msg.authorId}</p>
                  <span className="text-xs text-slate-400">{formatTime(msg.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-200">{msg.text}</p>
              </article>
            ))}
            {!messages.length && <p className="text-sm text-slate-400">Нет сообщений</p>}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Отправка сообщения</p>
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none"
            placeholder="Текст сообщения"
            value={text}
            onChange={(e) => setText(e.target.value)}
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
