import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { DailyActivities } from '@/components/patient/DailyActivities'

export default async function PatientActivities() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
    include: { clientAsPatient: { include: { memories: { take: 5 } } } }
  })

  const client = user?.clientAsPatient

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>Daily Activities</h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>Personalised activities just for you.</p>
      <DailyActivities
        clientId={client?.id || ''}
        clientName={client?.name || 'Eleanor'}
        memoryTitles={client?.memories.map(m => m.title) || []}
      />
    </div>
  )
}
