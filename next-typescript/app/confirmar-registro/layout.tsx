import { ReactNode, Suspense } from 'react'

export default function ConfirmarRegistroLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>
}
