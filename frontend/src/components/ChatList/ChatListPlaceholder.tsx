type ChatListPlaceholderProps = {
  title?: string
}

export const ChatListPlaceholder = ({ title = 'Chat list placeholder' }: ChatListPlaceholderProps) => (
  <div className="rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-300">
    {title}. Реализуем после генерации REST клиента.
  </div>
)
