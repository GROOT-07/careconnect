import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  let where: Record<string, unknown> = {}
  if (clientId) where.clientId = clientId
  if (user.role === 'CAREGIVER') {
    const cg = await db.caregiver.findUnique({ where: { userId: user.id } })
    if (cg) where.caregiverId = cg.id
  }
  const logs = await db.activityLog.findMany({
    where, include: { client: true, caregiver: { include: { user: true } } },
    orderBy: { completedAt: 'desc' }, take: 50,
  })
  return NextResponse.json(logs)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'CAREGIVER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await req.json()
  const cg = await db.caregiver.findUnique({ where: { userId: user.id } })
  if (!cg) return NextResponse.json({ error: 'No caregiver profile' }, { status: 400 })
  const log = await db.activityLog.create({ data: { ...body, caregiverId: cg.id } })
  return NextResponse.json(log)
}
