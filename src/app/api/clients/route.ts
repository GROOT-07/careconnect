import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let clients
  if (user.role === 'ADMIN') {
    clients = await db.client.findMany({ include: { assignedCaregiver: { include: { user: true } }, familyContact: true } })
  } else if (user.role === 'FAMILY') {
    clients = await db.client.findMany({ where: { familyContactId: user.id }, include: { assignedCaregiver: { include: { user: true } }, medications: true } })
  } else if (user.role === 'CAREGIVER') {
    const cg = await db.caregiver.findUnique({ where: { userId: user.id } })
    clients = cg ? await db.client.findMany({ where: { assignedCaregiverId: cg.id }, include: { medications: true } }) : []
  } else if (user.role === 'PATIENT') {
    clients = await db.client.findMany({ where: { patientUserId: user.id }, include: { medications: true, memories: true } })
  }

  return NextResponse.json(clients || [])
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await req.json()
  const client = await db.client.create({ data: { ...body, conditions: JSON.stringify(body.conditions || []) } })
  return NextResponse.json(client)
}
