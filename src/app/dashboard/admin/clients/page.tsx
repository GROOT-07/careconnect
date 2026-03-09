import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function AdminClients() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  const clients = await db.client.findMany({
    include: { assignedCaregiver: { include: { user: true } }, familyContact: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>Clients</h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>All registered clients on the platform.</p>
      <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--cream)' }}>
              {['Name', 'Age', 'Status', 'Caregiver', 'Family Contact', 'Conditions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500 }}>{c.name}</td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}>{c.age}</td>
                <td style={{ padding: '14px 16px', fontSize: 13 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, background: c.status === 'ACTIVE' ? 'rgba(139,175,141,0.15)' : 'rgba(196,114,74,0.1)', color: c.status === 'ACTIVE' ? 'var(--sage-dark)' : 'var(--terra)', fontWeight: 500 }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}>{c.assignedCaregiver?.user?.name || '—'}</td>
                <td style={{ padding: '14px 16px', fontSize: 14 }}>{c.familyContact?.name || '—'}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--warm-gray)' }}>{c.conditions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
