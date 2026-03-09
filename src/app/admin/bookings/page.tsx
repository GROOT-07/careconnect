import { db } from '@/lib/db'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatTime, SERVICE_LABELS } from '@/lib/utils'

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    include: { client: true, caregiver: { include: { user: true } } },
    orderBy: { scheduledAt: 'asc' },
  })

  const statusVariant: Record<string, 'sage'|'sky'|'sand'|'terra'> = {
    CONFIRMED:'sage', PENDING:'sky', COMPLETED:'sand', CANCELLED:'terra'
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">Booking Management</h1>
          <p className="text-warm-gray font-light">All scheduled and pending visits.</p>
        </div>
        <button className="btn-primary">+ New Booking</button>
      </div>
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-light-gray bg-cream/50">
            <tr>{['Client','Caregiver','Date & Time','Service','Duration','Status','Actions'].map(h => <th key={h} className="text-left py-4 px-5 text-xs uppercase tracking-wide text-warm-gray font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-b border-light-gray/50 hover:bg-cream/40 transition-colors">
                <td className="py-4 px-5 font-medium">{b.client.name}</td>
                <td className="py-4 px-5">{b.caregiver?.user.name || <span className="text-warm-gray">Unassigned</span>}</td>
                <td className="py-4 px-5">{formatDate(b.scheduledAt)} · {formatTime(b.scheduledAt)}</td>
                <td className="py-4 px-5">{SERVICE_LABELS[b.serviceType] || b.serviceType}</td>
                <td className="py-4 px-5">{b.durationMins} min</td>
                <td className="py-4 px-5"><Badge variant={statusVariant[b.status] || 'sand'}>{b.status}</Badge></td>
                <td className="py-4 px-5">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-cream border border-light-gray rounded-lg text-xs hover:border-sage transition-colors">Edit</button>
                    <button className="px-3 py-1.5 text-terra border border-terra-light rounded-lg text-xs hover:bg-terra-light transition-colors">Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
