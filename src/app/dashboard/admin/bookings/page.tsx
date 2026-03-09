import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

const SERVICE_LABELS: Record<string, string> = {
  MORNING_CARE: 'Morning Care', PERSONAL_CARE: 'Personal Care',
  MEDICATION: 'Medication', MEAL_PREP: 'Meal Prep',
  COMPANIONSHIP: 'Companionship', DOCTOR_ESCORT: 'Doctor Escort',
  EVENING_ROUTINE: 'Evening Routine',
}

export default async function AdminBookings() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  const bookings = await db.booking.findMany({
    include: { client: true, caregiver: { include: { user: true } } },
    orderBy: [{ scheduledAt: 'asc' }],
  })

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>Bookings</h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>All scheduled appointments.</p>
      <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--cream)' }}>
              {['Client', 'Service', 'Date & Time', 'Duration', 'Caregiver', 'Status'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 500 }}>{b.client.name}</td>
                <td style={{ padding: '13px 16px', fontSize: 14 }}>{SERVICE_LABELS[b.serviceType] || b.serviceType}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--warm-gray)' }}>
                  {new Date(b.scheduledAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </td>
                <td style={{ padding: '13px 16px', fontSize: 14 }}>{b.durationMins}m</td>
                <td style={{ padding: '13px 16px', fontSize: 14 }}>{b.caregiver?.user?.name || '—'}</td>
                <td style={{ padding: '13px 16px', fontSize: 13 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontWeight: 500,
                    background: b.status === 'CONFIRMED' ? 'rgba(139,175,141,0.15)' : b.status === 'PENDING' ? 'rgba(123,158,199,0.15)' : 'rgba(200,195,188,0.3)',
                    color: b.status === 'CONFIRMED' ? 'var(--sage-dark)' : b.status === 'PENDING' ? 'var(--sky)' : 'var(--warm-gray)' }}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
