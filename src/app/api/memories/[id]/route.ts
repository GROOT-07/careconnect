import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await context.params
  const memory = await db.memory.findUnique({
    where: { id },
    include: { chatHistory: { orderBy: { createdAt: 'asc' } } }
  })
  return NextResponse.json(memory)
}
