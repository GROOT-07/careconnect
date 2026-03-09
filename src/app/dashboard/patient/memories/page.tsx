import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { MemoryGrid } from '@/components/family/MemoryGrid'
import { AddMemoryButton } from '@/components/patient/AddMemoryButton'

export default async function PatientMemories() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
    include: { clientAsPatient: { include: { memories: { orderBy: { year: 'asc' } } } } }
  })

  const client = user?.clientAsPatient
  const memories = client?.memories || []

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>My Memories</h1>
          <p style={{ fontSize: 14, color: 'var(--warm-gray)', fontWeight: 300 }}>Your life story, beautifully preserved.</p>
        </div>
        {client && <AddMemoryButton clientId={client.id} />}
      </div>
      <MemoryGrid memories={memories} clientName={client?.name || 'Eleanor'} />
    </div>
  )
}
