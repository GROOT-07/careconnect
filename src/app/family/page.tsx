import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { StatCard } from '@/components/shared/StatCard'
import { Timeline } from '@/components/shared/Timeline'
import { AlertItem } from '@/components/shared/AlertItem'
import { formatTime } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default async function FamilyPage() {
  const user = await getCurrentUser()
  const client = await db.client.findFirst({
    where: { familyContactId: user!.id },
    include: {
      activityLogs: { include: { caregiver: { include: { user: true } } }, orderBy: { completedAt: 'desc' }, take: 6 },
      bookings: { where: { status: { in: ['CONFIRMED','PENDING'] }, scheduledAt: { gte: new Date() } }, include: { caregiver: { include: { user: true } } }, orderBy: { scheduledAt: 'asc' }, take: 1 },
      moodCheckins: { orderBy: { checkedAt: 'desc' }, take: 7 },
      medications: { where: { isActive: true } },
    }
  })

  const moodEmojiMap: Record<string, string> = { happy: '😊', calm: '😌', tired: '😴', worried: '😟', sad: '😢' }
  const latestMood = client?.moodCheckins[0]?.mood ?? ''
  const completedToday = client?.activityLogs.filter(l => new Date(l.completedAt).toDateString() === new Date().toDateString()).length ?? 0
  const nextBooking = client?.bookings[0]

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">
          Welcome back, <em className="text-sky">{user?.name?.split(' ')[0]}</em> 👋
        </h1>
        <p className="text-warm-gray font-light">
          {client ? `${client.name} is doing well. Here's today's update.` : 'No client profile linked yet.'}
        </p>
      </div>

      {client && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6 animate-stagger">
            <StatCard label="Tasks Today" value={`${completedToday}/${client.activityLogs.length}`} delta="On track" />
            <StatCard label="Next Visit" value={nextBooking ? formatTime(nextBooking.scheduledAt) : 'None'} />
            <StatCard label="Medications" value={client.medications.length} delta="Active" />
            <StatCard label="Mood Today" value={moodEmojiMap[latestMood] || "—"} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-fraunces text-xl font-medium mb-4">Care Activity Today</h3>
              {client.activityLogs.length > 0 ? (
                <Timeline items={client.activityLogs.map(l => ({
                  title: l.notes || l.activityType.replace(/_/g,' '),
                  meta: `${l.caregiver?.user?.name ?? 'Unknown'} · ${formatTime(l.completedAt)}`,
                  color: '#8BAF8D',
                }))} />
              ) : <p className="text-sm text-warm-gray">No activities logged yet today.</p>}
              <Link href="/family/booking" className="mt-4 block text-sm text-sky font-medium hover:underline">Book next visit →</Link>
            </div>

            <div className="card">
              <h3 className="font-fraunces text-xl font-medium mb-4">Alerts & Updates</h3>
              {client.medications.map(m => (
                <AlertItem key={m.id} variant="warning" title={`Medication: ${m.name}`} description={`${m.dosage} · ${m.frequency} · ${m.timeOfDay}`} />
              ))}
              {nextBooking && (
                <AlertItem variant="success" title="Upcoming Visit Confirmed"
                  description={`${nextBooking.caregiver?.user?.name ?? 'Caregiver'} · ${formatTime(nextBooking.scheduledAt)}`} />
              )}
              <AlertItem variant="info" title="Weekly Wellbeing Report" description="Eleanor's mood has been positive this week. 😊" />

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wide text-warm-gray font-medium mb-3">Mood This Week</p>
                <div className="flex gap-1.5 items-end h-16">
                  {client.moodCheckins.slice(0,7).reverse().map((c, i) => (
                    <div key={i} className="flex-1 rounded-t-md transition-all" style={{ height: '60%', background: i === client.moodCheckins.length-1 ? '#5E8561' : '#C5D9C6' }} />
                  ))}
                </div>
                <div className="flex gap-1.5 mt-1">
                  {['M','T','W','T','F','S','S'].map((d,i) => <div key={i} className="flex-1 text-center text-[9px] text-warm-gray">{d}</div>)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
