import { Component, type ReactNode } from 'react'
import { debugLog } from '../utils/debugLog'

type Props = { children: ReactNode }
type State = { hasError: boolean; error?: Error }

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    debugLog('boundary:error', { message: error.message, stack: error.stack, info: errorInfo })
    // eslint-disable-next-line no-console
    console.error('AppErrorBoundary caught', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-sm text-rose-100 bg-rose-900/40 border border-rose-500/40 rounded-xl">
          <p className="font-semibold">Произошла ошибка в приложении.</p>
          <p className="mt-2 text-rose-200">Проверьте консоль и логи (window.__wmLogs) для деталей.</p>
        </div>
      )
    }

    return this.props.children
  }
}
