import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function AdminCaregivers() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  const caregivers = await db.caregiver.findMany({
    include: { user: true, clients: { include: { bookings: true } } },
    orderBy: { user: { name: 'asc' } },
  })

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>Caregivers</h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>All caregivers on the platform.</p>
      <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--cream)' }}>
              {['Name', 'Email', 'Clients', 'Total Hours', 'Rating', 'On Duty'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {caregivers.map(cg => {
              const totalMins = cg.clients.reduce((acc, c) => acc + c.bookings.reduce((a, b) => a + b.durationMins, 0), 0)
              return (
                <tr key={cg.id}>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500 }}>{cg.user.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--warm-gray)' }}>{cg.user.email}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14 }}>{cg.clients.length}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14 }}>{(totalMins / 60).toFixed(1)}h</td>
                  <td style={{ padding: '14px 16px', fontSize: 14 }}>{cg.rating.toFixed(1)}★</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, background: cg.isOnDuty ? 'rgba(139,175,141,0.15)' : 'rgba(200,195,188,0.3)', color: cg.isOnDuty ? 'var(--sage-dark)' : 'var(--warm-gray)', fontWeight: 500 }}>
                      {cg.isOnDuty ? 'On Duty' : 'Off Duty'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
