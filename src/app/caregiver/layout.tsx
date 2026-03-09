import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashNav } from '@/components/layout/DashNav'
import { ToastProvider } from '@/components/ui/Toast'

export default async function CaregiverLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'CAREGIVER') redirect('/')
  const tabs = [
    { label: 'My Schedule', href: '/caregiver' },
    { label: 'Clients', href: '/caregiver/clients' },
    { label: 'Activity Log', href: '/caregiver/log' },
  ]
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <DashNav user={{ name: user.name, email: user.email, role: user.role }} tabs={tabs} />
        <main className="flex-1 bg-cream p-8">{children}</main>
      </div>
    </ToastProvider>
  )
}
