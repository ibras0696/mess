import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

type ProtectedRouteProps = PropsWithChildren & {
  fallbackPath?: string
}

export const ProtectedRoute = ({ children, fallbackPath = '/login' }: ProtectedRouteProps) => {
  const { accessToken, authReady } = useAuthStore()

  if (!authReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-300">
        Проверяем авторизацию...
      </div>
    )
  }

  if (!accessToken) {
    return <Navigate to={fallbackPath} replace />
  }

  return children
}
