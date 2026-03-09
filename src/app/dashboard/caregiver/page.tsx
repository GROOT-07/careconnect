import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { TaskList } from '@/components/caregiver/TaskList'

export default async function CaregiverDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  if ((session.user as any).role !== 'CAREGIVER') redirect('/dashboard')

  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
    include: { caregiverProfile: { include: {
      clients: {
        include: {
          bookings: { where: { scheduledAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }, orderBy: { scheduledAt: 'asc' } },
          moodCheckins: { orderBy: { checkedAt: 'desc' }, take: 1 },
        }
      }
    }}}
  })

  const caregiver = user?.caregiverProfile
  const clients = caregiver?.clients || []
  const todayBookings = clients.flatMap(c => c.bookings)

  const schedule = todayBookings.map(b => ({
    time: new Date(b.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    title: b.serviceType.replace(/_/g, ' '),
    client: clients.find(c => c.id === b.clientId)?.name || '',
    status: b.status,
    id: b.id,
  }))

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>My Schedule</h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>Today&apos;s tasks and clients.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Clients Today" value={clients.length} icon="👥" color="var(--sage)" />
        <StatCard label="Appointments" value={todayBookings.length} icon="📅" color="var(--sky)" />
        <StatCard label="Rating" value={`${caregiver?.rating?.toFixed(1) || '5.0'}★`} icon="⭐" color="var(--terra)" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <Card title="Today's Appointments">
          <TaskList initialTasks={schedule} />
        </Card>
        <Card title="My Clients">
          {clients.map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--light-gray)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'var(--sage-dark)' }}>
                {c.name[0]}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: 'var(--warm-gray)' }}>{c.status}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
