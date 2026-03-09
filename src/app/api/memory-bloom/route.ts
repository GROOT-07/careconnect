import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { enhanceMemory, generateMemoryConversation } from '@/lib/ai'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { action, memoryId, message, history, clientName } = await req.json()

  if (action === 'enhance') {
    const memory = await db.memory.findUnique({ where: { id: memoryId } })
    if (!memory) return NextResponse.json({ error: 'Memory not found' }, { status: 404 })
    const enhanced = await enhanceMemory({
      title: memory.title, year: memory.year?.toString() || undefined,
      category: memory.category || undefined,
      description: memory.description, clientName: clientName || 'Eleanor',
    })
    await db.memory.update({ where: { id: memoryId }, data: { aiEnhanced: enhanced } })
    return NextResponse.json({ enhanced })
  }

  if (action === 'chat') {
    const memory = await db.memory.findUnique({ where: { id: memoryId } })
    if (!memory) return NextResponse.json({ error: 'Memory not found' }, { status: 404 })
    const response = await generateMemoryConversation(
      { title: memory.title, description: memory.description, aiEnhanced: memory.aiEnhanced },
      message, history || []
    )
    return NextResponse.json({ response })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
