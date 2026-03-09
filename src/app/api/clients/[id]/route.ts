import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await context.params
  const client = await db.client.findUnique({
    where: { id },
    include: { assignedCaregiver: { include: { user: true } }, familyContact: true, medications: true, memories: true, moodCheckins: { orderBy: { checkedAt: 'desc' }, take: 7 } }
  })
  return NextResponse.json(client)
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !['ADMIN', 'CAREGIVER'].includes(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await context.params
  const body = await req.json()
  const client = await db.client.update({ where: { id }, data: body })
  return NextResponse.json(client)
}
