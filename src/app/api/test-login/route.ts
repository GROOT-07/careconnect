import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const user = await db.user.findUnique({ where: { email: 'sarah@family.com' } })
    if (!user) return NextResponse.json({ step: 'user_not_found' })
    const valid = await bcrypt.compare('family123', user.passwordHash)
    return NextResponse.json({ step: 'complete', userFound: true, passwordValid: valid, role: user.role })
  } catch (e: any) {
    return NextResponse.json({ step: 'error', message: e.message, code: e.code })
  }
}
