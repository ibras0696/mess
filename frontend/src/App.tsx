import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useWSStore } from './store/useWSStore'
import { useAuthBootstrap } from './hooks/useAuthBootstrap'

function App() {
  const user = useAuthStore((state) => state.user)
  const connected = useWSStore((state) => state.connected)

  useAuthBootstrap()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1224] via-[#0f172a] to-[#0b1224] px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-lg backdrop-blur">
          <NavLink to="/" className="text-lg font-semibold text-white">
            Web Messenger
          </NavLink>
          <nav className="flex items-center gap-4 text-sm text-slate-200">
            <NavLink className="transition hover:text-white" to="/login">
              Login
            </NavLink>
            <NavLink className="transition hover:text-white" to="/register">
              Register
            </NavLink>
            <NavLink className="transition hover:text-white" to="/chats">
              Chats
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            {connected && <span className="h-2 w-2 rounded-full bg-emerald-400" title="WS connected" />}
            {user ? (
              <span className="text-sm text-slate-100">{user.username}</span>
            ) : (
              <span className="text-xs text-slate-400">anon</span>
            )}
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  )
}

export default App
