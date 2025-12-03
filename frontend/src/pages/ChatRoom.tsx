import { MessageInputPlaceholder } from '../components/MessageInput/MessageInputPlaceholder'
import { MessageListPlaceholder } from '../components/MessageList/MessageListPlaceholder'

export const ChatRoomPage = () => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Диалог</p>
        <h2 className="text-xl font-semibold text-white">/chat/:id</h2>
      </div>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">WS + REST</span>
    </div>
    <div className="mt-4 space-y-3">
      <MessageListPlaceholder />
      <MessageInputPlaceholder />
    </div>
  </div>
)
