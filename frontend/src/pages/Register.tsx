import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/http/auth'
import { ApiError } from '../api/http/client'

export const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await authApi.register({ email, password, username })
      setSuccess('Аккаунт создан. Можно войти.')
      navigate('/login')
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('Пользователь уже существует')
      } else {
        setError('Не удалось зарегистрироваться. Проверьте API.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card max-w-md p-6">
      <h2 className="text-xl font-semibold text-white">Регистрация</h2>
      <p className="mt-1 text-sm text-slate-300">POST /auth/register → получаем id/email/username.</p>
      {error && (
        <div className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-100">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
          {success}
        </div>
      )}
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none"
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-lg shadow-emerald-400/30 transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Создаём...' : 'Создать аккаунт'}
        </button>
      </form>
    </div>
  )
}
