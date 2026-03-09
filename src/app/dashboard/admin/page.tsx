import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Timeline } from '@/components/ui/Timeline'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  const today = new Date(new Date().setHours(0,0,0,0))
  const todayEnd = new Date(new Date().setHours(23,59,59,999))

  const [clientCount, caregiverCount, todayBookings, pendingBookings, recentLogs] = await Promise.all([
    db.client.count(),
    db.caregiver.count(),
    db.booking.count({ where: { scheduledAt: { gte: today, lt: todayEnd } } }),
    db.booking.count({ where: { status: 'PENDING' } }),
    db.activityLog.findMany({ orderBy: { completedAt: 'desc' }, take: 6, include: { client: true, caregiver: { include: { user: true } } } }),
  ])

  const allCaregivers = await db.caregiver.findMany({ include: { user: true, clients: { include: { bookings: true } } } })

  const timelineItems = recentLogs.map(l => ({
    title: l.title || l.activityType.replace(/_/g, ' '),
    meta: `${l.client.name} · ${l.caregiver?.user?.name ?? 'Unknown'}`,
    color: '#8BAF8D',
  }))

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>Admin Overview</h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>Platform performance at a glance.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Clients" value={clientCount} icon="👥" color="var(--sage)" />
        <StatCard label="Caregivers" value={caregiverCount} icon="🩺" color="var(--sky)" />
        <StatCard label="Today's Bookings" value={todayBookings} icon="📅" color="var(--terra)" />
        <StatCard label="Pending" value={pendingBookings} icon="⏳" color="var(--lavender)" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card title="Recent Activity">
          <Timeline items={timelineItems} />
        </Card>
        <Card title="Caregiver Utilization">
          {allCaregivers.map(cg => {
            const totalMins = cg.clients.reduce((acc, c) => acc + c.bookings.reduce((a, b) => a + b.durationMins, 0), 0)
            const hours = (totalMins / 60).toFixed(1)
            return (
              <div key={cg.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--light-gray)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{cg.user.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--warm-gray)' }}>{cg.clients.length} clients</div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--sage-dark)', fontWeight: 500 }}>{hours}h</div>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}
