'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardRoot() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = ((session.user as any).role as string || '').toLowerCase()
      router.replace(`/dashboard/${role}`)
    } else if (status === 'unauthenticated') {
      router.replace('/auth/login')
    }
  }, [session, status, router])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, color: 'var(--sage-dark)', opacity: 0.6 }}>Redirecting…</div>
    </div>
  )
}
