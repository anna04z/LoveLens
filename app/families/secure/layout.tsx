import { Suspense } from 'react'
export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-emerald-50 flex items-center justify-center"><p className="text-emerald-300">loading...</p></div>}>{children}</Suspense>
}
