import { ChatListPlaceholder } from '../components/ChatList/ChatListPlaceholder'

export const ChatsPage = () => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Список чатов</p>
        <h2 className="text-xl font-semibold text-white">GET /chats</h2>
      </div>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">REST</span>
    </div>
    <div className="mt-4">
      <ChatListPlaceholder title="Чаты подгружаются из API" />
    </div>
  </div>
)
