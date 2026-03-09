import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'

export default async function CaregiverClients() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
    include: { caregiverProfile: { include: {
      clients: {
        include: {
          moodCheckins: { orderBy: { checkedAt: 'desc' }, take: 1 },
          medications: { where: { isActive: true } },
        }
      }
    }}}
  })

  const clients = user?.caregiverProfile?.clients || []

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>My Clients</h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>Manage and monitor your assigned clients.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {clients.map(c => (
          <Card key={c.id} title={c.name}>
            <div style={{ fontSize: 13, color: 'var(--warm-gray)', marginBottom: 8 }}>Age {c.age} · {c.status}</div>
            <div style={{ fontSize: 13, marginBottom: 4 }}><strong>Conditions:</strong> {c.conditions}</div>
            {c.dietaryNotes && <div style={{ fontSize: 13, marginBottom: 4 }}><strong>Diet:</strong> {c.dietaryNotes}</div>}
            <div style={{ fontSize: 13, marginTop: 8, color: 'var(--sage-dark)' }}>
              💊 {c.medications.length} active medications · {c.moodCheckins[0] ? `Mood: ${c.moodCheckins[0].emoji || c.moodCheckins[0].mood}` : 'No mood logged'}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
