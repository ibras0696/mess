type LogEntry = {
  ts: string
  msg: string
  data?: unknown
}

const MAX_LOGS = 200

const pushEntry = (entry: LogEntry) => {
  if (typeof window === 'undefined') return
  const storeKey = '__wmLogs'
  const existing = (window as any)[storeKey] as LogEntry[] | undefined
  const next = [...(existing ?? []), entry].slice(-MAX_LOGS)
  ;(window as any)[storeKey] = next
}

export const debugLog = (msg: string, data?: unknown) => {
  const entry: LogEntry = { ts: new Date().toISOString(), msg, data }
  pushEntry(entry)
  // Видимые логи в консоли, чтобы повторять шаги пользователя
  // eslint-disable-next-line no-console
  console.debug('[wm]', msg, data ?? '')
}

export const getDebugLogs = () => {
  if (typeof window === 'undefined') return []
  return ((window as any).__wmLogs as LogEntry[] | undefined) ?? []
}

export const initGlobalErrorLogging = () => {
  if (typeof window === 'undefined') return
  const w = window as any
  if (w.__wmErrorLogger) return
  w.__wmErrorLogger = true

  window.addEventListener('error', (ev) => {
    debugLog('global:error', { message: ev.message, stack: ev.error?.stack })
  })
  window.addEventListener('unhandledrejection', (ev) => {
    debugLog('global:unhandledrejection', { reason: ev.reason })
  })
}
