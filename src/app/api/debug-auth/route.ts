import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const user = await db.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'User not found', email })
    const valid = await bcrypt.compare(password, user.passwordHash)
    return NextResponse.json({ found: true, valid, role: user.role, hashPrefix: user.passwordHash.substring(0, 10) })
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}
