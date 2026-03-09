import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { MessagingClient } from '@/components/family/MessagingClient'

export default async function FamilyMessages() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
    include: {
      clientAsFamily: {
        include: {
          messages: { orderBy: { sentAt: 'asc' } },
          assignedCaregiver: { include: { user: true } },
        }
      }
    }
  })

  const client = user?.clientAsFamily?.[0]
  const messages = (client?.messages || []).map(m => ({
    id: m.id,
    content: m.content,
    sentAt: m.sentAt.toISOString(),
    senderName: m.senderName,
    senderId: m.senderId,
    isOwn: m.senderId === (user?.id || ''),
  }))

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>Messages</h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>
        Your conversations with {client?.name}&apos;s care team.
      </p>
      <MessagingClient
        initialMessages={messages}
        caregiverName={client?.assignedCaregiver?.user?.name || 'Your Caregiver'}
        clientId={client?.id || ''}
        userId={user?.id || ''}
      />
    </div>
  )
}
