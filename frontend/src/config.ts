const RAW_API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000/api'
const WS_URL = (import.meta.env.VITE_WS_URL as string | undefined) ?? 'ws://localhost:8000/ws'

const apiUrl = RAW_API_URL.replace(/\/$/, '')
const apiBaseUrl = apiUrl.replace(/\/api$/, '')

export const appConfig = {
  apiUrl,
  apiBaseUrl,
  apiPrefix: apiUrl.startsWith(apiBaseUrl) ? apiUrl.slice(apiBaseUrl.length) : '',
  wsUrl: WS_URL,
}
