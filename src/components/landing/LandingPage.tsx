'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

const roles = [
  { id: 'family', label: 'Family Member', emoji: '👨‍👩‍👧', desc: 'Stay connected with your loved one\'s care. View logs, memories, and book visits.', color: '#4A72A0', borderColor: 'hover:border-sky' },
  { id: 'caregiver', label: 'Caregiver', emoji: '🩺', desc: 'Manage your schedule, log care activities, and update client records.', color: '#5E8561', borderColor: 'hover:border-sage-dark' },
  { id: 'patient', label: 'Memory Bloom', emoji: '🌸', desc: 'Explore your life stories, cherished memories, and gentle daily activities.', color: '#7B6BC4', borderColor: 'hover:border-[#9B8EC4]' },
  { id: 'admin', label: 'Administrator', emoji: '⚙️', desc: 'Oversee all clients, caregivers, scheduling, and platform analytics.', color: '#C4724A', borderColor: 'hover:border-terra' },
]

const demoCredentials: Record<string, { email: string; password: string }> = {
  family: { email: 'sarah@family.com', password: 'family123' },
  caregiver: { email: 'maria@careconnect.com', password: 'caregiver123' },
  patient: { email: 'eleanor@patient.com', password: 'patient123' },
  admin: { email: 'admin@careconnect.com', password: 'admin123' },
}

export function LandingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function openLogin(role: string) {
    setSelectedRole(role)
    setEmail(demoCredentials[role].email)
    setPassword(demoCredentials[role].password)
    setError('')
  }

  async function handleLogin() {
    setLoading(true)
    setError('')
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) { setError('Invalid email or password'); return }
      // Fetch session to get role
      const res = await fetch('/api/auth/session')
      const session = await res.json()
      const role = session?.user?.role
      const routes: Record<string, string> = { ADMIN: '/dashboard/admin', FAMILY: '/dashboard/family', CAREGIVER: '/dashboard/caregiver', PATIENT: '/dashboard/patient' }
      router.push(routes[role] || '/dashboard/family')
    } finally {
      setLoading(false)
    }
  }

  const role = roles.find(r => r.id === selectedRole)

  return (
    <div className="min-h-screen bg-[#FFFCF8]">
      {/* Nav */}
      <nav className="flex justify-between items-center px-16 py-5 border-b border-light-gray sticky top-0 bg-[#FFFCF8]/90 backdrop-blur-sm z-40">
        <div className="font-fraunces text-xl font-semibold text-[#2C2825] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sage animate-pulse-slow inline-block" />
          CareConnect
        </div>
        <div className="flex items-center gap-8">
          <a href="#roles" className="text-sm text-warm-gray hover:text-[#2C2825] transition-colors">Portals</a>
          <a href="#booking" className="text-sm text-warm-gray hover:text-[#2C2825] transition-colors">Book a Visit</a>
          <button onClick={() => openLogin('admin')} className="btn-primary text-sm px-5 py-2.5">Admin Login</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-16 pt-24 pb-20 grid grid-cols-2 gap-20 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-sage-light text-sage-dark text-xs font-medium px-4 py-2 rounded-full uppercase tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-dark" /> Compassionate Care Platform
          </div>
          <h1 className="font-fraunces text-6xl font-medium text-[#2C2825] leading-[1.07] tracking-tight mb-6">
            Care that <em className="text-sage-dark">remembers</em> what matters most
          </h1>
          <p className="text-lg text-warm-gray font-light leading-relaxed mb-10 max-w-lg">
            CareConnect unifies caregivers, families, and clients in one seamless platform — with Memory Bloom at its heart, preserving stories and dignity.
          </p>
          <div className="flex gap-4">
            <button onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary">
              Access Your Portal
            </button>
            <button onClick={() => openLogin('family')} className="btn-secondary">
              Book a Care Session
            </button>
          </div>
        </div>
        {/* Floating cards */}
        <div className="relative h-96 hidden lg:block">
          <div className="absolute w-3/4 h-3/4 rounded-full bg-sage-light/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          {[
            { cls: 'top-4 left-0 w-52 animate-float', label: 'Active Client', name: 'Eleanor R.', sub: 'Morning care · 9:00 AM', pill: 'On Schedule', pillColor: 'bg-sage-light text-sage-dark', delay: '0s' },
            { cls: 'top-24 right-0 w-56 animate-float', label: 'Memory Bloom', name: "Today's Memory", sub: '"The summer in Maine…"', pill: 'New Entry', pillColor: 'bg-terra-light text-terra', delay: '1.2s' },
            { cls: 'bottom-4 left-8 w-60 animate-float', label: 'Next Appointment', name: 'Dr. Patel Visit', sub: 'Frank D. · Tomorrow 2PM', pill: 'Confirmed', pillColor: 'bg-sky-light text-sky', delay: '2.4s' },
          ].map((card, i) => (
            <div key={i} className={`absolute bg-white rounded-2xl p-4 shadow-lg ${card.cls}`} style={{ animationDelay: card.delay }}>
              <p className="text-xs uppercase tracking-wide text-warm-gray mb-1">{card.label}</p>
              <p className="font-fraunces text-lg font-medium text-[#2C2825]">{card.name}</p>
              <p className="text-xs text-warm-gray mt-0.5">{card.sub}</p>
              <span className={`pill mt-2 inline-flex ${card.pillColor}`}>{card.pill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Role Cards */}
      <section id="roles" className="max-w-6xl mx-auto px-16 py-20">
        <p className="text-xs font-medium uppercase tracking-widest text-warm-gray mb-4">Portal Access</p>
        <h2 className="font-fraunces text-4xl font-medium text-[#2C2825] tracking-tight mb-3">Choose your role<br/>to get started</h2>
        <p className="text-base text-warm-gray font-light mb-12 max-w-lg">Each portal is tailored for your relationship with care.</p>
        <div className="grid grid-cols-4 gap-5">
          {roles.map(r => (
            <div key={r.id}
              onClick={() => openLogin(r.id)}
              className={`card cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2 border-transparent ${r.borderColor} group`}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                style={{ background: `${r.color}15` }}>
                {r.emoji}
              </div>
              <h3 className="font-fraunces text-xl font-medium text-[#2C2825] mb-2">{r.label}</h3>
              <p className="text-sm text-warm-gray leading-relaxed mb-5">{r.desc}</p>
              <span className="text-sm font-medium transition-all group-hover:gap-3 flex items-center gap-2" style={{ color: r.color }}>
                Enter Portal <span>→</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA */}
      <section id="booking" className="bg-gradient-to-br from-sage-dark to-[#3D6640] py-20 text-center">
        <h2 className="font-fraunces text-4xl font-medium text-white tracking-tight mb-3">Ready to schedule a care visit?</h2>
        <p className="text-white/70 text-base mb-8 font-light">Browse available slots and book in under 2 minutes.</p>
        <button onClick={() => openLogin('family')} className="bg-white text-sage-dark font-medium px-8 py-4 rounded-full text-sm shadow-xl hover:-translate-y-1 transition-all hover:shadow-2xl">
          Book a Slot Now
        </button>
      </section>

      {/* Demo credentials hint */}
      <section className="max-w-6xl mx-auto px-16 py-12">
        <div className="card bg-cream border-sand/40">
          <h3 className="font-fraunces text-lg font-medium mb-4">🔑 Demo Credentials</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            {Object.entries(demoCredentials).map(([role, creds]) => (
              <div key={role} className="bg-white rounded-xl p-3 border border-light-gray">
                <p className="font-medium capitalize mb-1">{role === 'patient' ? 'Memory Bloom' : role}</p>
                <p className="text-warm-gray text-xs">{creds.email}</p>
                <p className="text-warm-gray text-xs">{creds.password}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-light-gray px-16 py-8 flex justify-between items-center text-sm text-warm-gray">
        <span className="font-fraunces text-base font-medium text-[#2C2825] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sage inline-block" /> CareConnect
        </span>
        <span>© 2026 CareConnect · Compassionate Care Technology</span>
        <span>Privacy · Terms · Support</span>
      </footer>

      {/* Login Modal */}
      <Modal open={!!selectedRole} onClose={() => setSelectedRole(null)}>
        {role && (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-4"
                style={{ background: `${role.color}15`, color: role.color }}>
                {role.emoji} {role.label}
              </div>
              <h2 className="font-fraunces text-2xl font-medium text-[#2C2825] mb-1">Sign In</h2>
              <p className="text-sm text-warm-gray">Enter your credentials to access your portal.</p>
            </div>
            <div className="bg-cream rounded-xl p-3 text-xs text-warm-gray mb-5 flex gap-2">
              💡 Demo credentials pre-filled. Just click Sign In.
            </div>
            <div className="space-y-4 mb-6">
              <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              {error && <p className="text-sm text-terra">{error}</p>}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setSelectedRole(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleLogin} loading={loading} className="flex-[2]"
                style={{ background: role.color, boxShadow: `0 6px 20px ${role.color}40` }}>
                Sign In →
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
