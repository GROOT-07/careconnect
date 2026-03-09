import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashNav } from '@/components/layout/DashNav'
import { ToastProvider } from '@/components/ui/Toast'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') redirect('/')
  const tabs = [
    { label: 'Overview', href: '/admin' },
    { label: 'Clients', href: '/admin/clients' },
    { label: 'Caregivers', href: '/admin/caregivers' },
    { label: 'Bookings', href: '/admin/bookings' },
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
