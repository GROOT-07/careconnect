import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ActivityLogForm } from '@/components/caregiver/ActivityLogForm'
import { Card } from '@/components/ui/Card'
import { Timeline } from '@/components/ui/Timeline'

export default async function CaregiverLog() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
    include: { caregiverProfile: { include: { clients: true } } }
  })

  const caregiver = user?.caregiverProfile
  const clients = caregiver?.clients || []

  const recentLogs = caregiver ? await db.activityLog.findMany({
    where: { caregiverId: caregiver.id },
    orderBy: { completedAt: 'desc' },
    take: 10,
    include: { client: true },
  }) : []

  const timelineItems = recentLogs.map(log => ({
    title: log.title || log.activityType.replace(/_/g, ' '),
    meta: new Date(log.completedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    color: '#8BAF8D',
  }))

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>Activity Log</h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>Record care activities for your clients.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <ActivityLogForm clients={clients.map(c => ({ id: c.id, name: c.name }))} caregiverId={caregiver?.id || ''} />
        <Card title="Recent Activity">
          <Timeline items={timelineItems} />
        </Card>
      </div>
    </div>
  )
}
