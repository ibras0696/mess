export const LoginPage = () => (
  <div className="glass-card max-w-md p-6">
    <h2 className="text-xl font-semibold text-white">Вход</h2>
    <p className="mt-1 text-sm text-slate-300">POST /auth/login → сохранение access/refresh.</p>
    <form className="mt-4 space-y-3">
      <input
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none"
        placeholder="Email"
        type="email"
      />
      <input
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none"
        placeholder="Пароль"
        type="password"
      />
      <button
        type="button"
        className="w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-400/30 transition hover:-translate-y-[1px]"
      >
        Войти
      </button>
    </form>
  </div>
)
