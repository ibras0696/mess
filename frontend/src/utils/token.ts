const ACCESS_KEY = 'wm.access'
const REFRESH_KEY = 'wm.refresh'

export const tokenStorage = {
  save(access: string, refresh: string) {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  },
  load() {
    if (typeof localStorage === 'undefined') return { access: null, refresh: null }
    return { access: localStorage.getItem(ACCESS_KEY), refresh: localStorage.getItem(REFRESH_KEY) }
  },
  clear() {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}
