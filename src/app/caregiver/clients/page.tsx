import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { Badge } from '@/components/ui/Badge'

export default async function CaregiverClientsPage() {
  const user = await getCurrentUser()
  const cg = await db.caregiver.findUnique({
    where: { userId: user!.id },
    include: { clients: { include: { medications: true, bookings: { orderBy: { scheduledAt: 'desc' }, take: 1 } } } }
  })

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">My Clients</h1>
      <p className="text-warm-gray font-light mb-8">Manage and view detailed care information.</p>
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-light-gray bg-cream/50">
            <tr>{['Client','Conditions','Today\'s Visit','Care Notes','Action'].map(h => <th key={h} className="text-left py-4 px-5 text-xs uppercase tracking-wide text-warm-gray font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {(cg?.clients || []).map(c => {
              let conditions: string[] = []
              try { conditions = JSON.parse(c.conditions) } catch { conditions = [c.conditions] }
              return (
                <tr key={c.id} className="border-b border-light-gray/50 hover:bg-cream/40 transition-colors">
                  <td className="py-4 px-5">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-warm-gray">{c.age} yrs</p>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex gap-1 flex-wrap">{conditions.map((cd,i) => <Badge key={i} variant="sand">{cd}</Badge>)}</div>
                  </td>
                  <td className="py-4 px-5">{c.bookings[0] ? new Date(c.bookings[0].scheduledAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '—'}</td>
                  <td className="py-4 px-5 text-warm-gray max-w-[200px]"><p className="truncate">{c.careNotes || '—'}</p></td>
                  <td className="py-4 px-5"><button className="px-4 py-1.5 bg-sage-dark text-white rounded-lg text-xs hover:opacity-90 transition-opacity">View</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
