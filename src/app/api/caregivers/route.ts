import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const caregivers = await db.caregiver.findMany({
    include: { user: true, clients: true, availability: true },
  })
  return NextResponse.json(caregivers)
}
