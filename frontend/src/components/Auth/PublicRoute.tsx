import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

type PublicRouteProps = PropsWithChildren & {
  redirectPath?: string
}

/**
 * Public-only маршруты. Если пользователь уже авторизован — отправляем в redirectPath.
 */
export const PublicRoute = ({ children, redirectPath = '/chats' }: PublicRouteProps) => {
  const { accessToken, authReady } = useAuthStore()

  if (!authReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-300">
        Проверяем авторизацию...
      </div>
    )
  }

  if (accessToken) {
    return <Navigate to={redirectPath} replace />
  }

  return children
}
