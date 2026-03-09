import { db } from '@/lib/db'
import { StatCard } from '@/components/shared/StatCard'
import { AlertItem } from '@/components/shared/AlertItem'
import { Timeline } from '@/components/shared/Timeline'
import { Badge } from '@/components/ui/Badge'

export default async function AdminPage() {
  const [clients, caregivers, bookings, logs] = await Promise.all([
    db.client.count(),
    db.caregiver.count(),
    db.booking.count({ where: { scheduledAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } }),
    db.activityLog.findMany({ include: { client: true, caregiver: { include: { user: true } } }, orderBy: { completedAt: 'desc' }, take: 5 }),
  ])

  const allCaregivers = await db.caregiver.findMany({ include: { user: true, clients: true } })

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">Admin Overview</h1>
        <p className="text-warm-gray font-light">Platform health and activity.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6 animate-stagger">
        <StatCard label="Total Clients" value={clients} delta="3 this month" />
        <StatCard label="Active Caregivers" value={caregivers} />
        <StatCard label="Visits Today" value={bookings} delta="On schedule" />
        <StatCard label="Open Slots" value={7} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-fraunces text-xl font-medium mb-4">Weekly Visit Volume</h3>
          <div className="flex gap-2 items-end h-24">
            {[55,70,85,60,90,75,65].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-lg transition-all hover:opacity-80 cursor-pointer" style={{ height:`${h}%`, background: i === 6 ? '#5E8561' : '#C5D9C6' }} />
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="flex-1 text-center text-[10px] text-warm-gray">{d}</div>)}
          </div>
        </div>
        <div className="card">
          <h3 className="font-fraunces text-xl font-medium mb-4">Incident Alerts</h3>
          <AlertItem variant="warning" title="Missed medication" description="Eleanor R. Lisinopril not confirmed at 10 AM." />
          <AlertItem variant="info" title="Schedule conflict" description="Frank D. has overlapping slots on Mar 10. Needs resolution." />
          <AlertItem variant="success" title="All caregivers checked in" description="Morning shift — no absences reported." />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-fraunces text-xl font-medium mb-4">Caregiver Utilization</h3>
          <div className="flex flex-col gap-4">
            {allCaregivers.map(cg => (
              <div key={cg.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{cg.user.name}</span>
                  <span className="text-warm-gray">{cg.clients.length} clients · ⭐ {cg.rating.toFixed(1)}</span>
                </div>
                <div className="h-1.5 bg-light-gray rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width:`${Math.min(cg.clients.length * 30, 100)}%`, background:'#5E8561' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-fraunces text-xl font-medium mb-4">Recent Activity</h3>
          <Timeline items={logs.map(l => ({
            title: l.notes || l.activityType.replace(/_/g,' '),
            meta: `${l.client.name} · ${l.caregiver?.user?.name ?? 'Unknown'}`,
            color: '#8BAF8D',
          }))} />
        </div>
      </div>
    </div>
  )
}
