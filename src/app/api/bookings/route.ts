import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const caregiverId = searchParams.get('caregiverId')

  let where: Record<string, unknown> = {}
  if (clientId) where.clientId = clientId
  if (caregiverId) where.caregiverId = caregiverId

  // Family: only their client's bookings
  if (user.role === 'FAMILY') {
    const client = await db.client.findFirst({ where: { familyContactId: user.id } })
    if (client) where.clientId = client.id
  }
  // Caregiver: only their bookings
  if (user.role === 'CAREGIVER') {
    const cg = await db.caregiver.findUnique({ where: { userId: user.id } })
    if (cg) where.caregiverId = cg.id
  }

  const bookings = await db.booking.findMany({
    where,
    include: { client: true, caregiver: { include: { user: true } } },
    orderBy: { scheduledAt: 'asc' },
  })
  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const booking = await db.booking.create({
    data: {
      clientId: body.clientId,
      caregiverId: body.caregiverId,
      serviceType: body.serviceType,
      scheduledAt: new Date(body.scheduledAt),
      durationMins: body.durationMins || 60,
      notes: body.notes,
      status: 'PENDING',
    },
    include: { client: true, caregiver: { include: { user: true } } },
  })
  return NextResponse.json(booking)
}
