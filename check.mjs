import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const db = new PrismaClient()
const u = await db.user.findUnique({ where: { email: 'sarah@family.com' } })
console.log('Found:', !!u)
console.log('Hash:', u?.passwordHash)
const valid = await bcrypt.compare('family123', u.passwordHash)
console.log('Password valid:', valid)
await db.$disconnect()