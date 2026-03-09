// Handled by NextAuth at /api/auth/[...nextauth]
export async function POST() {
  return Response.json({ error: 'Use /api/auth/signin' }, { status: 410 })
}
