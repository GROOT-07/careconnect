import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { clientId, mood, emoji, note } = await req.json()
  const log = await db.moodCheckin.create({
    data: { clientId, mood, emoji, notes: note }
  })
  return NextResponse.json(log)
}
