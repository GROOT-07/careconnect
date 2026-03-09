'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  clients: { id: string; name: string }[]
  caregiverId: string
}

export function ActivityLogForm({ clients, caregiverId }: Props) {
  const router = useRouter()
  const [clientId, setClientId] = useState(clients[0]?.id || '')
  const [type, setType] = useState('medication')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  async function save() {
    if (!title.trim()) return
    setSaving(true)
    try {
      await fetch('/api/caregivers/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, type, title, notes, caregiverId }),
      })
      setTitle('')
      setNotes('')
      setSuccess(true)
      setTimeout(() => { setSuccess(false); router.refresh() }, 2000)
    } finally {
      setSaving(false)
    }
  }

  const selectStyle = {
    width: '100%', padding: '12px 14px', border: '1.5px solid var(--light-gray)',
    borderRadius: 12, fontSize: 14, background: 'var(--cream)', outline: 'none',
    fontFamily: 'DM Sans, sans-serif', color: 'var(--charcoal)',
  } as React.CSSProperties

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {success && (
        <div style={{ background: 'rgba(139,175,141,0.15)', border: '1px solid var(--sage)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--sage-dark)' }}>
          ✅ Activity logged successfully!
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Client</label>
        <select value={clientId} onChange={e => setClientId(e.target.value)} style={selectStyle}>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Activity Type</label>
        <select value={type} onChange={e => setType(e.target.value)} style={selectStyle}>
          <option value="medication">Medication Administered</option>
          <option value="personal_care">Personal Care</option>
          <option value="meal">Meal Preparation</option>
          <option value="companionship">Companionship</option>
          <option value="medical">Medical Visit</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Morning medication administered"
          style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--light-gray)', borderRadius: 12, fontSize: 14, background: 'var(--cream)', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add any relevant details…"
          style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--light-gray)', borderRadius: 12, fontSize: 14, background: 'var(--cream)', outline: 'none', resize: 'none', height: 80, fontFamily: 'DM Sans, sans-serif' }}
        />
      </div>

      <button onClick={save} disabled={saving || !title.trim()} style={{
        background: 'var(--sage-dark)', color: 'white', border: 'none',
        borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 500,
        cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
        opacity: saving ? 0.7 : 1, transition: 'all 0.2s',
      }}>
        {saving ? 'Saving…' : 'Save Activity'}
      </button>
    </div>
  )
}
