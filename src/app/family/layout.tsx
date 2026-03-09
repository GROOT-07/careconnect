import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashNav } from '@/components/layout/DashNav'
import { ToastProvider } from '@/components/ui/Toast'

export default async function FamilyLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/')
  if (user.role !== 'FAMILY') redirect('/')
  const tabs = [
    { label: 'Overview', href: '/family', active: false },
    { label: 'Book Visit', href: '/family/booking', active: false },
    { label: 'Memories', href: '/family/memories', active: false },
    { label: 'Messages', href: '/family/messages', active: false },
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
