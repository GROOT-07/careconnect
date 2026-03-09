import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  if (!clientId) return NextResponse.json([])
  const checkins = await db.moodCheckin.findMany({ where: { clientId }, orderBy: { checkedAt: 'desc' }, take: 30 })
  return NextResponse.json(checkins)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { clientId, mood, notes } = await req.json()
  const checkin = await db.moodCheckin.create({ data: { clientId, mood, notes } })
  return NextResponse.json(checkin)
}
