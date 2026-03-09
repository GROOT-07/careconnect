import { db } from '@/lib/db'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export default async function AdminClientsPage() {
  const clients = await db.client.findMany({
    include: { assignedCaregiver: { include: { user: true } }, familyContact: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">All Clients</h1>
          <p className="text-warm-gray font-light">Manage client profiles, care plans, and assignments.</p>
        </div>
        <button className="btn-primary">+ Add Client</button>
      </div>
      <div className="card mb-4 flex gap-3">
        <input className="input flex-1" placeholder="Search clients by name, condition…" />
        <select className="input w-40">
          <option>All Status</option>
          <option>Active</option>
          <option>Priority</option>
          <option>Monitoring</option>
        </select>
      </div>
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-light-gray bg-cream/50">
            <tr>{['Name','Age','Conditions','Caregiver','Family','Status','Actions'].map(h => <th key={h} className="text-left py-4 px-5 text-xs uppercase tracking-wide text-warm-gray font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {clients.map(c => {
              let conds: string[] = []
              try { conds = JSON.parse(c.conditions) } catch { conds = [c.conditions] }
              const statusMap: Record<string, 'sage'|'terra'|'sky'|'sand'> = { ACTIVE:'sage', PRIORITY:'terra', MONITORING:'sky', INACTIVE:'sand' }
              return (
                <tr key={c.id} className="border-b border-light-gray/50 hover:bg-cream/40 transition-colors">
                  <td className="py-4 px-5"><p className="font-medium">{c.name}</p><p className="text-xs text-warm-gray">{c.id.slice(0,8)}</p></td>
                  <td className="py-4 px-5">{c.age}</td>
                  <td className="py-4 px-5"><div className="flex gap-1 flex-wrap">{conds.slice(0,2).map((cd,i) => <Badge key={i} variant="sand" className="text-[10px]">{cd}</Badge>)}</div></td>
                  <td className="py-4 px-5">{c.assignedCaregiver?.user.name || '—'}</td>
                  <td className="py-4 px-5">{c.familyContact?.name || '—'}</td>
                  <td className="py-4 px-5"><Badge variant={statusMap[c.status] || 'sand'}>{c.status}</Badge></td>
                  <td className="py-4 px-5">
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-cream border border-light-gray rounded-lg text-xs hover:border-sage transition-colors">Edit</button>
                      <button className="px-3 py-1.5 bg-sage-dark text-white rounded-lg text-xs hover:opacity-90 transition-opacity">View</button>
                    </div>
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
