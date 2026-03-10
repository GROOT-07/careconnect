'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const ROLE_CONFIG = {
  FAMILY:   { color: '#4A72A0',        label: 'Family Portal' },
  CAREGIVER:{ color: 'var(--sage-dark)', label: 'Caregiver Portal' },
  PATIENT:  { color: '#7B6BC4',        label: 'Memory Bloom' },
  ADMIN:    { color: 'var(--terra)',    label: 'Admin Dashboard' },
}

const ROLE_TABS = {
  FAMILY: [
    { label: 'Overview',     href: '/dashboard/family' },
    { label: 'Book a Visit', href: '/dashboard/family/booking' },
    { label: 'Memories',     href: '/dashboard/family/memories' },
    { label: 'Messages',     href: '/dashboard/family/messages' },
  ],
  CAREGIVER: [
    { label: 'My Schedule',  href: '/dashboard/caregiver' },
    { label: 'Clients',      href: '/dashboard/caregiver/clients' },
    { label: 'Activity Log', href: '/dashboard/caregiver/log' },
  ],
  PATIENT: [
    { label: 'Today',        href: '/dashboard/patient' },
    { label: 'My Memories',  href: '/dashboard/patient/memories' },
    { label: 'Activities',   href: '/dashboard/patient/activities' },
  ],
  ADMIN: [
    { label: 'Overview',   href: '/dashboard/admin' },
    { label: 'Clients',    href: '/dashboard/admin/clients' },
    { label: 'Caregivers', href: '/dashboard/admin/caregivers' },
    { label: 'Bookings',   href: '/dashboard/admin/bookings' },
  ],
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
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
      <style>{`
        @media (max-width: 768px) {
          .dash-nav-tabs { display: none !important; }
          .dash-nav-user { display: none !important; }
          .dash-menu-btn { display: flex !important; }
          .dash-content { padding: 20px 16px !important; }
          .dash-mobile-menu { display: block !important; }
        }
        @media (min-width: 769px) {
          .dash-menu-btn { display: none !important; }
          .dash-mobile-menu { display: none !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: '1px solid var(--light-gray)',
        background: 'white', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 600, color: cfg.color, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
          CareConnect
        </Link>

        {/* Desktop tabs */}
        <div className="dash-nav-tabs" style={{ display: 'flex', gap: 2 }}>
          {tabs.map(tab => {
            const active = pathname === tab.href
            return (
              <Link key={tab.href} href={tab.href} style={{
                padding: '7px 14px', borderRadius: 10, fontSize: 13,
                fontWeight: active ? 500 : 400,
                color: active ? 'var(--charcoal)' : 'var(--warm-gray)',
                background: active ? 'var(--cream)' : 'transparent',
                textDecoration: 'none', transition: 'all 0.15s',
              }}>{tab.label}</Link>
            )
          })}
        </div>

        {/* Desktop user */}
        <div className="dash-nav-user" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontSize: 13, color: 'white', fontWeight: 600 }}>
            {initial}
          </div>
          <span style={{ fontSize: 13, color: 'var(--warm-gray)' }}>{session.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={{
            fontSize: 12, color: 'var(--warm-gray)', background: 'none',
            border: '1px solid var(--light-gray)', padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
          }}>Sign out</button>
        </div>

        {/* Mobile hamburger */}
        <button className="dash-menu-btn" onClick={() => setMenuOpen(o => !o)} style={{
          display: 'none', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 8,
        }}>
          <span style={{ width: 22, height: 2, background: 'var(--charcoal)', borderRadius: 2, display: 'block' }} />
          <span style={{ width: 22, height: 2, background: 'var(--charcoal)', borderRadius: 2, display: 'block' }} />
          <span style={{ width: 22, height: 2, background: 'var(--charcoal)', borderRadius: 2, display: 'block' }} />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="dash-mobile-menu" style={{
          background: 'white', borderBottom: '1px solid var(--light-gray)',
          padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {tabs.map(tab => {
            const active = pathname === tab.href
            return (
              <Link key={tab.href} href={tab.href} onClick={() => setMenuOpen(false)} style={{
                padding: '10px 14px', borderRadius: 10, fontSize: 14,
                fontWeight: active ? 500 : 400,
                color: active ? 'var(--charcoal)' : 'var(--warm-gray)',
                background: active ? 'var(--cream)' : 'transparent',
                textDecoration: 'none',
              }}>{tab.label}</Link>
            )
          })}
          <div style={{ borderTop: '1px solid var(--light-gray)', marginTop: 8, paddingTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--warm-gray)' }}>{session.user?.name}</span>
            <button onClick={() => signOut({ callbackUrl: '/' })} style={{
              fontSize: 13, color: 'var(--terra)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}>Sign out</button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="dash-content" style={{ flex: 1, padding: '32px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {children}
      </div>
    </div>
  )
}
