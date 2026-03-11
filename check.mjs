import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
const u = await db.user.findUnique({ where: { email: 'sarah@family.com' } })
console.log('Found:', !!u)
console.log('Role:', u?.role)
console.log('Hash exists:', !!u?.passwordHash)
console.log('Hash:', u?.passwordHash?.substring(0, 20))
await db.$disconnect()