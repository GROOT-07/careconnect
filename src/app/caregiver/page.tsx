import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { StatCard } from '@/components/shared/StatCard'
import { AlertItem } from '@/components/shared/AlertItem'
import { formatTime, SERVICE_LABELS } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

export default async function CaregiverPage() {
  const user = await getCurrentUser()
  const cg = await db.caregiver.findUnique({
    where: { userId: user!.id },
    include: {
      clients: { include: { medications: { where: { isActive: true } } } },
      bookings: {
        where: { scheduledAt: { gte: new Date(new Date().setHours(0,0,0,0)), lt: new Date(new Date().setHours(23,59,59,999)) } },
        include: { client: true },
        orderBy: { scheduledAt: 'asc' }
      },
    }
  })

  const today = new Date()
  const todayLogs = await db.activityLog.findMany({
    where: { caregiverId: cg?.id, completedAt: { gte: new Date(today.setHours(0,0,0,0)) } }
  })

  const tasks = [
    { done: true, label: 'Morning clean-up — Eleanor R.', time: '7:30' },
    { done: true, label: 'Breakfast assistance — Eleanor R.', time: '8:15' },
    { done: false, label: 'Administer medication — Eleanor R.', time: '10:00' },
    { done: false, label: 'Personal care — Frank D.', time: '11:30' },
    { done: false, label: 'Lunch preparation — Frank D.', time: '12:30' },
    { done: false, label: "Doctor's appointment — Margaret S.", time: '14:00' },
  ]

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">
            Good morning, <em className="text-sage-dark">{user?.name?.split(' ')[0]}</em> 🌿
          </h1>
          <p className="text-warm-gray font-light">You have {cg?.bookings.length || 0} visits scheduled today.</p>
        </div>
        <span className="pill bg-sage-light text-sage-dark text-sm font-medium px-4 py-2">🟢 On Duty</span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6 animate-stagger">
        <StatCard label="Clients Today" value={cg?.clients.length || 0} />
        <StatCard label="Tasks Done" value={`${todayLogs.length}/7`} />
        <StatCard label="Hours Today" value="6.5" />
        <StatCard label="Next Visit" value={cg?.bookings[0] ? formatTime(cg.bookings[0].scheduledAt) : '--'} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-fraunces text-xl font-medium mb-4">Today's Tasks</h3>
          <div className="flex flex-col gap-2">
            {tasks.map((t, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${t.done ? 'bg-cream' : 'bg-white border border-light-gray'}`}>
                <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all ${t.done ? 'bg-sage border-sage' : 'border-light-gray'}`}>
                  {t.done && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className={`flex-1 text-sm ${t.done ? 'line-through text-warm-gray' : 'text-[#2C2825]'}`}>{t.label}</span>
                <span className="text-xs text-warm-gray">{t.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-fraunces text-xl font-medium mb-4">Alerts</h3>
            <AlertItem variant="warning" title="Medication due at 10 AM" description="Eleanor R. · Lisinopril + Aspirin. Confirm when administered." />
            <AlertItem variant="info" title="New care notes" description="Dr. Patel added notes for Margaret S. Review before visit." />
            <AlertItem variant="success" title="Frank D. confirmed" description="Appointment at 11:30 AM. Client is expecting you." />
          </div>
          <div className="card">
            <h3 className="font-fraunces text-xl font-medium mb-3">Today's Route</h3>
            {[
              { name: 'Eleanor R.', addr: '14 Oak Lane', dist: '0.8 mi', color: '#5E8561' },
              { name: 'Frank D.', addr: '8 Maple Ave', dist: '2.1 mi', color: '#7B9EC7' },
              { name: 'Margaret S.', addr: '22 Elm St', dist: '1.4 mi', color: '#C4724A' },
            ].map((c, i, arr) => (
              <div key={i}>
                <div className="flex items-center gap-3 py-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-sm flex-1">{c.name} · {c.addr}</span>
                  <span className="text-xs text-warm-gray">{c.dist}</span>
                </div>
                {i < arr.length-1 && <div className="w-0.5 h-4 bg-light-gray ml-[3px]" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
