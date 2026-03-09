'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

const ROLE_CONFIG = {
  FAMILY: { color: '#4A72A0', accentBg: 'var(--sky-light)', label: 'Family Portal', navColor: '#4A72A0' },
  CAREGIVER: { color: 'var(--sage-dark)', accentBg: 'rgba(139,175,141,0.15)', label: 'Caregiver Portal', navColor: 'var(--sage-dark)' },
  PATIENT: { color: '#7B6BC4', accentBg: 'var(--lavender-light)', label: 'Memory Bloom', navColor: '#7B6BC4' },
  ADMIN: { color: 'var(--terra)', accentBg: 'var(--terra-light)', label: 'Admin Dashboard', navColor: 'var(--terra)' },
}

const ROLE_TABS = {
  FAMILY: [
    { label: 'Overview', href: '/dashboard/family' },
    { label: 'Book a Visit', href: '/dashboard/family/booking' },
    { label: 'Memories', href: '/dashboard/family/memories' },
    { label: 'Messages', href: '/dashboard/family/messages' },
  ],
  CAREGIVER: [
    { label: 'My Schedule', href: '/dashboard/caregiver' },
    { label: 'Clients', href: '/dashboard/caregiver/clients' },
    { label: 'Activity Log', href: '/dashboard/caregiver/log' },
  ],
  PATIENT: [
    { label: 'Today', href: '/dashboard/patient' },
    { label: 'My Memories', href: '/dashboard/patient/memories' },
    { label: 'Activities', href: '/dashboard/patient/activities' },
  ],
  ADMIN: [
    { label: 'Overview', href: '/dashboard/admin' },
    { label: 'Clients', href: '/dashboard/admin/clients' },
    { label: 'Caregivers', href: '/dashboard/admin/caregivers' },
    { label: 'Bookings', href: '/dashboard/admin/bookings' },
  ],
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: 'var(--sage-dark)', opacity: 0.6 }}>Loading…</div>
      </div>
    )
  }

  if (!session) return null

  const role = (session.user as any).role as keyof typeof ROLE_CONFIG
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.FAMILY
  const tabs = ROLE_TABS[role] || []
  const initial = (session.user as any).avatarInitial || (session.user?.name?.[0] ?? '?')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--cream)' }}>
      {/* Nav */}
      <nav style={{
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', borderBottom: '1px solid var(--light-gray)',
        background: 'white', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 600, color: cfg.navColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
          CareConnect
        </Link>

        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map(tab => {
            const active = pathname === tab.href
            return (
              <Link key={tab.href} href={tab.href} style={{
                padding: '8px 16px', borderRadius: 10, fontSize: 13,
                fontWeight: active ? 500 : 400,
                color: active ? 'var(--charcoal)' : 'var(--warm-gray)',
                background: active ? 'var(--cream)' : 'transparent',
                textDecoration: 'none', transition: 'all 0.15s',
              }}>{tab.label}</Link>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {role === 'CAREGIVER' && (
            <span style={{ fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 100, background: 'rgba(139,175,141,0.2)', color: 'var(--sage-dark)' }}>🟢 On Duty</span>
          )}
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontSize: 14, color: 'white', fontWeight: 600 }}>
            {initial}
          </div>
          <span style={{ fontSize: 13, color: 'var(--warm-gray)' }}>{session.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={{
            fontSize: 13, color: 'var(--warm-gray)', background: 'none',
            border: '1px solid var(--light-gray)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
          }}>Sign out</button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, padding: '36px 40px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {children}
      </div>
    </div>
  )
}
