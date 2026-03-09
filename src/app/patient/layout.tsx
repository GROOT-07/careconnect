import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashNav } from '@/components/layout/DashNav'
import { ToastProvider } from '@/components/ui/Toast'

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'PATIENT') redirect('/')
  const tabs = [
    { label: 'Today', href: '/patient' },
    { label: 'My Memories', href: '/patient/memories' },
    { label: 'Activities', href: '/patient/activities' },
  ]
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg,#F5F0FA 0%,#FAF7F2 100%)' }}>
        <DashNav user={{ name: user.name, email: user.email, role: user.role }} tabs={tabs} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </ToastProvider>
  )
}
