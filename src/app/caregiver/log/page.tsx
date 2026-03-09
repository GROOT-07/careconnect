'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Timeline } from '@/components/shared/Timeline'
import { useToast } from '@/components/ui/Toast'
import { formatTime } from '@/lib/utils'

export default function CaregiverLogPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<Record<string, unknown>[]>([])
  const [clientId, setClientId] = useState('client-eleanor')
  const [activityType, setActivityType] = useState('MEDICATION_GIVEN')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetch('/api/activity-logs').then(r => r.json()).then(setLogs) }, [])

  async function submitLog() {
    if (!notes.trim()) return
    setLoading(true)
    await fetch('/api/activity-logs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, activityType, notes }),
    })
    toast('Activity logged successfully ✅')
    setNotes('')
    const r = await fetch('/api/activity-logs')
    setLogs(await r.json())
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">Activity Log</h1>
      <p className="text-warm-gray font-light mb-8">Record and review all care activities.</p>
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-fraunces text-xl font-medium mb-5">Log New Activity</h3>
          <div className="flex flex-col gap-4">
            <Select label="Client" value={clientId} onChange={e => setClientId(e.target.value)}
              options={[{value:'client-eleanor',label:'Eleanor R.'},{value:'client-frank',label:'Frank D.'},{value:'client-margaret',label:'Margaret S.'}]} />
            <Select label="Activity Type" value={activityType} onChange={e => setActivityType(e.target.value)}
              options={[{value:'MEDICATION_GIVEN',label:'Medication Administered'},{value:'PERSONAL_CARE',label:'Personal Care'},{value:'MEAL_PREPARED',label:'Meal Preparation'},{value:'COMPANIONSHIP',label:'Companionship'},{value:'INCIDENT_REPORT',label:'Incident Report'},{value:'GENERAL',label:'General'}]} />
            <div>
              <label className="label">Notes</label>
              <textarea className="input h-24 resize-none" placeholder="Add relevant notes…" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <Button onClick={submitLog} loading={loading}>Save Activity</Button>
          </div>
        </div>
        <div className="card">
          <h3 className="font-fraunces text-xl font-medium mb-4">Recent Logs</h3>
          {logs.length > 0 ? (
            <Timeline items={logs.slice(0,8).map((l: Record<string, unknown>) => {
              const log = l as { notes?: string; activityType: string; completedAt: string; client?: { name?: string } }
              return {
                title: log.notes || log.activityType.replace(/_/g,' '),
                meta: `${log.client?.name || ''} · ${formatTime(log.completedAt)}`,
                color: '#8BAF8D',
              }
            })} />
          ) : <p className="text-sm text-warm-gray">No logs yet.</p>}
        </div>
      </div>
    </div>
  )
}
