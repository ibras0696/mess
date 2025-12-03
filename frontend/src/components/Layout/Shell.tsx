import type { PropsWithChildren } from 'react'

export const Shell = ({ children }: PropsWithChildren) => {
  return <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
}
