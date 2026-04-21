import { Suspense } from 'react'
export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-green-50 flex items-center justify-center"><p className="text-green-300">loading...</p></div>}>{children}</Suspense>
}
