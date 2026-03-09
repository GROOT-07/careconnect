import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { clientId, content } = await req.json()
  const user = await db.user.findUnique({ where: { email: session.user?.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const message = await db.message.create({
    data: { clientId, senderId: user.id, senderName: user.name ?? 'Unknown', content },
  })
  return NextResponse.json({
    id: message.id, content: message.content,
    sentAt: message.sentAt.toISOString(),
    senderName: message.senderName,
    senderId: message.senderId, isOwn: true,
  })
}
