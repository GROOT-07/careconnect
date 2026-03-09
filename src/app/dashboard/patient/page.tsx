import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { MoodLogger } from '@/components/patient/MoodLogger'
import { MemoryOfDay } from '@/components/patient/MemoryOfDay'

export default async function PatientDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  if ((session.user as any).role !== 'PATIENT') redirect('/dashboard')

  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
    include: {
      clientAsPatient: {
        include: {
          bookings: { where: { scheduledAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }, orderBy: { scheduledAt: 'asc' }, take: 5 },
          moodCheckins: { orderBy: { checkedAt: 'desc' }, take: 1 },
          memories: { orderBy: { createdAt: 'desc' }, take: 1 },
          medications: { where: { isActive: true } },
        }
      }
    }
  })

  const client = user?.clientAsPatient
  if (!client) redirect('/auth/login')

  const todayTasks = [
    ...client.medications.map(m => ({ text: `Take ${m.name} (${m.dosage})`, time: m.timeOfDay, done: false })),
    ...client.bookings.map(b => ({ text: b.serviceType.replace(/_/g, ' '), time: new Date(b.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), done: b.status === 'COMPLETED' })),
  ]

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>
        Good morning, {client.name.split(' ')[0]} 🌸
      </h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card title="Today's Schedule">
          {todayTasks.length === 0 ? (
            <p style={{ color: 'var(--warm-gray)', fontSize: 14 }}>Nothing scheduled yet today.</p>
          ) : (
            todayTasks.map((task, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--light-gray)' }}>
                <span style={{ fontSize: 18 }}>{task.done ? '✅' : '🔵'}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{task.text}</div>
                  <div style={{ fontSize: 12, color: 'var(--warm-gray)' }}>{task.time}</div>
                </div>
              </div>
            ))
          )}
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <MoodLogger clientId={client.id} currentMood={client.moodCheckins[0]?.mood} />
          {client.memories[0] && <MemoryOfDay memory={client.memories[0]} />}
        </div>
      </div>
    </div>
  )
}
