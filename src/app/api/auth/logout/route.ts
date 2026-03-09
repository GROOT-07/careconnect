// Handled by NextAuth at /api/auth/signout
export async function POST() {
  return Response.json({ error: 'Use /api/auth/signout' }, { status: 410 })
}
