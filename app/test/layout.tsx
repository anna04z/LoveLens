import { Suspense } from 'react'

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-rose-50 flex items-center justify-center"><p className="text-rose-300">loading...</p></div>}>{children}</Suspense>
}