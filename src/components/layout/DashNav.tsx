'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getInitials } from '@/lib/utils'
import { LogOut, Bell } from 'lucide-react'

interface DashNavProps {
  user: { name?: string | null; email: string; role: string }
  logoColor?: string
  tabs?: { label: string; href: string; active?: boolean }[]
}

const roleColors: Record<string, string> = {
  FAMILY: '#4A72A0',
  CAREGIVER: '#5E8561',
  PATIENT: '#7B6BC4',
  ADMIN: '#C4724A',
}
const roleAvatarBg: Record<string, string> = {
  FAMILY: 'bg-sky',
  CAREGIVER: 'bg-sage-dark',
  PATIENT: 'bg-[#7B6BC4]',
  ADMIN: 'bg-terra',
}

export function DashNav({ user, tabs }: DashNavProps) {
  const router = useRouter()
  const color = roleColors[user.role] || '#5E8561'

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <nav className="dash-nav">
      <div className="flex items-center gap-3">
        <span style={{ color }} className="font-fraunces text-lg font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block animate-pulse-slow" style={{ background: color }} />
          CareConnect
        </span>
      </div>
      {tabs && (
        <div className="flex gap-1">
          {tabs.map(tab => (
            <Link key={tab.href} href={tab.href}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${tab.active ? 'bg-cream text-[#2C2825] font-medium' : 'text-warm-gray hover:bg-cream'}`}>
              {tab.label}
            </Link>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center text-warm-gray hover:bg-light-gray transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terra rounded-full" />
        </button>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-fraunces font-semibold ${roleAvatarBg[user.role]}`}>
          {getInitials(user.name || user.email)}
        </div>
        <span className="text-sm text-[#2C2825] font-medium hidden sm:block">{user.name?.split(' ')[0]}</span>
        <button onClick={signOut} className="flex items-center gap-2 text-sm text-warm-gray hover:text-terra border border-light-gray px-3 py-1.5 rounded-lg transition-all hover:border-terra">
          <LogOut size={14} /> Exit
        </button>
      </div>
    </nav>
  )
}
