const sampleChats = [
  { id: 'dialog-42', title: 'Design review', unread: 2, lastMessage: 'Подключим WS после auth' },
  { id: 'group-1', title: 'Product crew', unread: 0, lastMessage: 'Докер поднят, идём в спринт 2' },
  { id: 'dialog-7', title: 'Ops', unread: 1, lastMessage: 'MinIO живёт, presign ждёт' },
]

const sampleMessages = [
  { id: 'm1', author: 'Я', text: 'Стартанули фронт, Tailwind готов.', ts: '09:20' },
  { id: 'm2', author: 'Teammate', text: 'Ок, жду auth экран и генерим клиент.', ts: '09:22' },
  { id: 'm3', author: 'Я', text: 'WS планирую после REST чатов.', ts: '09:25' },
]

export const HomePage = () => {
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-300/80">Web Messenger</p>
              <h1 className="text-3xl font-semibold text-white">Frontend Playground</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Спринт 2: подключаем auth flow по контракту и готовим роутинг приложения.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_0_8px_rgba(16,185,129,0.15)]" />
              <div>
                <p className="text-xs text-slate-400">Environment</p>
                <p className="font-medium text-slate-50">local · docker-compose</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatusPill title="Auth" detail="Login/Register подключены к API" />
            <StatusPill title="REST" detail="Клиент под GET/POST /chats готов" />
            <StatusPill title="WebSocket" detail="Подключим по /ws + Zustand стейт" />
          </div>
        </header>

        <main className="grid grid-cols-1 gap-6 lg:grid-cols-[320px,1fr]">
          <aside className="glass-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Чаты</h2>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                REST флоу
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {sampleChats.map((chat) => (
                <div
                  key={chat.id}
                  className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-left transition"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{chat.title}</p>
                    {chat.unread > 0 && (
                      <span className="rounded-full bg-sky-400/20 px-2 py-0.5 text-xs font-semibold text-sky-100">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{chat.lastMessage}</p>
                </div>
              ))}
              <div className="rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-slate-400">
                Создание чата: POST /chats (type, title, members[])
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="glass-card p-5">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-300/80">Диалог</p>
                  <h3 className="text-xl font-semibold text-white">Design review</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    online
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1">typing event · WS</span>
                </div>
              </header>
              <div className="mt-4 space-y-3">
                {sampleMessages.map((msg) => (
                  <article
                    key={msg.id}
                    className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{msg.author}</p>
                      <span className="text-xs text-slate-400">{msg.ts}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-200">{msg.text}</p>
                  </article>
                ))}
                <div className="rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-slate-400">
                  Отправка сообщения: REST /chats/:id/messages → позже заменим на WS send_message
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-slate-400">
                  Поле ввода (MessageInput)
                </div>
                <button className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-400/30 transition hover:-translate-y-[1px]">
                  Отправить
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <InfoCard title="Auth flow" detail="POST /auth/login | register | refresh, токены в хранилище" />
              <InfoCard title="Storage" detail="Zustand store: auth / chats / messages / ws" />
              <InfoCard title="Attachments" detail="Presign: POST /attachments/presign → прямой upload в MinIO" />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function StatusPill({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <p className="mt-1 text-sm font-semibold text-white">{detail}</p>
    </div>
  )
}

function InfoCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 shadow-inner shadow-white/5">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-300">{detail}</p>
    </div>
  )
}
