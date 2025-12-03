import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatCreateTypeEnum } from '../api/generated'
import { ResponseError } from '../api/generated/runtime'
import { useApiClients } from '../hooks/useApiClients'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import { formatTime } from '../utils/formatting'

export const ChatsPage = () => {
  const { chatsApi, usersApi } = useApiClients()
  const accessToken = useAuthStore((state) => state.accessToken)
  const authReady = useAuthStore((state) => state.authReady)
  const chats = useChatStore((state) => state.chats)
  const setChats = useChatStore((state) => state.setChats)
  const setActiveChat = useChatStore((state) => state.setActiveChat)
  const resetAuth = useAuthStore((state) => state.reset)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createTitle, setCreateTitle] = useState('')
  const [createType, setCreateType] = useState<'dialog' | 'group'>('group')
  const [createMembers, setCreateMembers] = useState('')
  const [users, setUsers] = useState<{ id: number; email?: string | null; username?: string | null }[]>([])

  const sortedChats = useMemo(
    () => [...chats].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')),
    [chats],
  )

  useEffect(() => {
    if (!authReady || !accessToken) return
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const list = await chatsApi.listChatsApiChatsGet()
        setChats(
          list.map((chat) => ({
            id: chat.id,
            title: chat.title ?? '(no title)',
            type: chat.type,
            unread: 0,
            createdAt: chat.createdAt.toISOString(),
          })),
        )
      } catch (err) {
        if (err instanceof ResponseError && err.response.status === 401) {
          resetAuth()
          navigate('/login')
          return
        }
        setError('Не удалось загрузить чаты. Проверьте API.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [accessToken, authReady, chatsApi, setChats, resetAuth, navigate])

  useEffect(() => {
    if (!authReady || !accessToken) return
    const loadUsers = async () => {
      setLoadingUsers(true)
      try {
        const list = await usersApi.listUsersApiUsersGet()
        setUsers(list)
      } catch (err) {
        if (err instanceof ResponseError && err.response.status === 401) {
          resetAuth()
          navigate('/login')
          return
        }
      } finally {
        setLoadingUsers(false)
      }
    }
    loadUsers()
  }, [accessToken, authReady, navigate, resetAuth, usersApi])

  const handleCreate = async () => {
    if (!accessToken) return
    setError(null)
    try {
      const members = createMembers
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean)
        .map((m) => Number(m))
        .filter((n) => !Number.isNaN(n))

      const created = await chatsApi.createChatApiChatsPost({
        chatCreate: { type: createType, title: createTitle || null, members },
      })
      const chatData = {
        id: created.id,
        title: created.title ?? '(no title)',
        type: created.type,
        unread: 0,
        createdAt: created.createdAt.toISOString(),
      }
      setChats([chatData, ...chats])
      setCreateTitle('')
      setCreateMembers('')
    } catch (err) {
      setError('Не удалось создать чат. Проверьте API.')
    }
  }

  const handleOpenChat = (chatId: number) => {
    setActiveChat(chatId)
    navigate(`/chat/${chatId}`)
  }

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Список чатов</p>
          <h2 className="text-xl font-semibold text-white">GET /api/chats</h2>
          <p className="text-[11px] text-slate-500 mt-1">
            Ваш user id: {accessToken ? useAuthStore.getState().user?.id ?? '—' : '—'}
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">REST</span>
      </div>

      {!authReady && <p className="mt-4 text-sm text-slate-400">Проверяем авторизацию...</p>}
      {error && (
        <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[320px,1fr]">
        <section className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Создать чат</h3>
            <span className="rounded-full bg-sky-400/10 px-2 py-1 text-xs text-sky-100">POST /api/chats</span>
          </div>
          <div className="mt-3 space-y-3">
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none"
              placeholder="Название"
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
            />
            <select
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-sky-400/60 focus:outline-none"
              value={createType}
              onChange={(e) => setCreateType(e.target.value as ChatCreateTypeEnum)}
            >
              <option value="group">group</option>
              <option value="dialog">dialog</option>
            </select>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none"
              placeholder="ID участников через запятую (например: 1,2,3)"
              value={createMembers}
              onChange={(e) => setCreateMembers(e.target.value)}
            />
            <button
              type="button"
              className="w-full rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-400/30 transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleCreate}
              disabled={loading}
            >
              Создать
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Мои чаты</h3>
            <span className="text-xs text-slate-400">{loading ? 'Загрузка...' : `${chats.length} шт.`}</span>
          </div>
          <div className="mt-3 space-y-2">
            {sortedChats.map((chat) => (
              <button
                key={chat.id}
                className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-left transition hover:border-sky-400/40 hover:bg-white/10"
                onClick={() => handleOpenChat(chat.id)}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{chat.title || '(no title)'}</p>
                  <span className="text-xs text-slate-400">{chat.createdAt ? formatTime(chat.createdAt) : ''}</span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{chat.type}</p>
              </button>
            ))}
            {!sortedChats.length && (
              <div className="rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-slate-400">
                Чатов нет. Создайте новый через форму слева.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Пользователи (для ID)</h3>
          <span className="text-xs text-slate-400">{loadingUsers ? 'Загрузка...' : `${users.length} шт.`}</span>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <div key={u.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-sm font-semibold text-white">{u.username ?? '(no username)'}</p>
              <p className="text-xs text-slate-300 break-all">{u.email ?? '—'}</p>
              <p className="text-[11px] text-slate-500">id: {u.id}</p>
            </div>
          ))}
          {!users.length && !loadingUsers && (
            <p className="text-sm text-slate-400">Нет данных. Проверьте доступ к /api/users.</p>
          )}
        </div>
      </div>
    </div>
  )
}
