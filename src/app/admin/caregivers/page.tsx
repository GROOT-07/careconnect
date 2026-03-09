import { db } from '@/lib/db'
import { Badge } from '@/components/ui/Badge'

export default async function AdminCaregiversPage() {
  const caregivers = await db.caregiver.findMany({ include: { user: true, clients: true } })

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">Caregivers</h1>
          <p className="text-warm-gray font-light">Team roster, availability, and performance.</p>
        </div>
        <button className="btn-primary">+ Add Caregiver</button>
      </div>
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-light-gray bg-cream/50">
            <tr>{['Name','Email','Clients','Specialties','Rating','Status','Actions'].map(h => <th key={h} className="text-left py-4 px-5 text-xs uppercase tracking-wide text-warm-gray font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {caregivers.map(cg => (
              <tr key={cg.id} className="border-b border-light-gray/50 hover:bg-cream/40 transition-colors">
                <td className="py-4 px-5 font-medium">{cg.user.name}</td>
                <td className="py-4 px-5 text-warm-gray">{cg.user.email}</td>
                <td className="py-4 px-5">{cg.clients.length}</td>
                <td className="py-4 px-5 text-warm-gray text-xs">{cg.specialties?.split(',').slice(0,2).join(', ')}</td>
                <td className="py-4 px-5">⭐ {cg.rating.toFixed(1)}</td>
                <td className="py-4 px-5"><Badge variant={cg.isOnDuty ? 'sage' : 'sand'}>{cg.isOnDuty ? 'On Duty' : 'Off Duty'}</Badge></td>
                <td className="py-4 px-5"><button className="px-3 py-1.5 bg-cream border border-light-gray rounded-lg text-xs hover:border-sage transition-colors">Manage</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
