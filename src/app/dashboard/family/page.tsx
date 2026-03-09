import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Timeline } from '@/components/ui/Timeline'
import { AlertList } from '@/components/ui/AlertList'

export default async function FamilyOverview() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  if ((session.user as any).role !== 'FAMILY') redirect('/dashboard')

  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
    include: {
      clientAsFamily: {
        include: {
          activityLogs: { orderBy: { completedAt: 'desc' }, take: 6 },
          bookings: { where: { scheduledAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }, orderBy: { scheduledAt: 'asc' } },
          moodCheckins: { orderBy: { checkedAt: 'desc' }, take: 1 },
          medications: { where: { isActive: true } },
          assignedCaregiver: { include: { user: true } },
        }
      }
    }
  })

  const client = user?.clientAsFamily?.[0]
  if (!client) redirect('/auth/login')

  const nextBooking = client.bookings[0]
  const mood = client.moodCheckins[0]

  const timelineItems = client.activityLogs.map(log => ({
    title: log.title || log.activityType.replace(/_/g, ' '),
    meta: new Date(log.completedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    color: '#8BAF8D',
  }))

  const alerts = [
    nextBooking ? { type: 'success' as const, icon: '✅', title: 'Appointment confirmed', desc: `${nextBooking.serviceType.replace(/_/g,' ')} at ${new Date(nextBooking.scheduledAt).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})} today.` } : null,
    { type: 'info' as const, icon: '💬', title: 'Care update', desc: `${client.assignedCaregiver?.user?.name || 'Your caregiver'} logged today's activities.` },
    mood ? { type: 'warning' as const, icon: mood.emoji || '😊', title: 'Mood check-in', desc: `${client.name} reported feeling ${mood.mood.toLowerCase()}.` } : null,
  ].filter(Boolean) as any[]

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>
        Good morning 👋
      </h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>
        Here&apos;s today&apos;s overview for {client.name}.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Active Medications" value={client.medications.length} icon="💊" color="var(--sage)" />
        <StatCard label="Today's Bookings" value={client.bookings.length} icon="📅" color="var(--sky)" />
        <StatCard label="Activities Logged" value={client.activityLogs.length} icon="📋" color="var(--terra)" />
        <StatCard label="Mood Today" value={mood?.emoji || '—'} icon="❤️" color="var(--lavender)" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card title="Recent Activity">
          <Timeline items={timelineItems} />
        </Card>
        <Card title="Alerts & Updates">
          <AlertList alerts={alerts} />
        </Card>
      </div>
    </div>
  )
}
