import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { clientId, type, title, notes, caregiverId } = await req.json()
  const log = await db.activityLog.create({
    data: { clientId, activityType: type, title, notes, caregiverId },
  })
  return NextResponse.json(log)
}
