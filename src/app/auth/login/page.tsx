'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DEMO_ACCOUNTS = [
  { role: 'Family', email: 'sarah@family.com', password: 'family123', emoji: '👨‍👩‍👧', color: '#4A72A0', bg: 'var(--sky-light)' },
  { role: 'Caregiver', email: 'maria@careconnect.com', password: 'caregiver123', emoji: '🩺', color: 'var(--sage-dark)', bg: 'rgba(139,175,141,0.15)' },
  { role: 'Patient', email: 'eleanor@patient.com', password: 'patient123', emoji: '🌸', color: '#7B6BC4', bg: 'var(--lavender-light)' },
  { role: 'Admin', email: 'admin@careconnect.com', password: 'admin123', emoji: '⚙️', color: 'var(--terra)', bg: 'var(--terra-light)' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email, password, redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
    } else {
      // Fetch session to get role and redirect
      const res = await fetch('/api/auth/session')
      const session = await res.json()
      const role = session?.user?.role?.toLowerCase()
      if (role) {
        router.push(`/dashboard/${role}`)
      } else {
        router.push('/')
      }
    }
  }

  function fillDemo(acc: typeof DEMO_ACCOUNTS[0]) {
    setEmail(acc.email)
    setPassword(acc.password)
    setError('')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 600, color: 'var(--charcoal)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sage)', display: 'inline-block' }} />
          CareConnect
        </Link>
        <Link href="/" style={{ fontSize: 13, color: 'var(--warm-gray)', textDecoration: 'none' }}>← Back to home</Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: 900, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>

          {/* Left: Demo accounts */}
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 500, marginBottom: 8, letterSpacing: '-0.5px' }}>Quick Access</h2>
            <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 24, fontWeight: 300 }}>Click any role to auto-fill demo credentials, then sign in.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.role} onClick={() => fillDemo(acc)} style={{
                  background: 'white', border: '1.5px solid var(--light-gray)', borderRadius: 16,
                  padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                  textAlign: 'left', transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif',
                }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: acc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{acc.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--charcoal)', marginBottom: 2 }}>{acc.role}</div>
                    <div style={{ fontSize: 12, color: 'var(--warm-gray)' }}>{acc.email}</div>
                  </div>
                  <div style={{ fontSize: 12, color: acc.color, fontWeight: 500 }}>Use →</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Login form */}
          <div style={{ background: 'white', borderRadius: 28, padding: 36, boxShadow: 'var(--shadow-md)' }}>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 500, marginBottom: 6, letterSpacing: '-0.5px' }}>Sign In</h1>
            <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 28, fontWeight: 300 }}>Enter your credentials to access your portal.</p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--light-gray)', borderRadius: 12, padding: '13px 16px', fontSize: 15, color: 'var(--charcoal)', outline: 'none' }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--light-gray)', borderRadius: 12, padding: '13px 16px', fontSize: 15, color: 'var(--charcoal)', outline: 'none' }}
                />
              </div>

              {error && (
                <div style={{ background: 'var(--terra-light)', color: 'var(--terra)', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', background: 'var(--sage-dark)', color: 'white',
                border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
                opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
              }}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
