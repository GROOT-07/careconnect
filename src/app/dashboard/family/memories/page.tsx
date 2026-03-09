import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { MemoryGrid } from '@/components/family/MemoryGrid'

export default async function FamilyMemories() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
    include: { clientAsFamily: { include: { memories: { orderBy: { createdAt: 'desc' } } } } }
  })

  const client = user?.clientAsFamily?.[0]
  const memories = client?.memories || []

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>Memory Bloom</h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>
        Precious memories for {client?.name || 'your loved one'}.
      </p>
      <MemoryGrid memories={memories} clientName={client?.name || 'Eleanor'} />
    </div>
  )
}
