'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AddMemoryButton({ clientId }: { clientId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [category, setCategory] = useState('family')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!title || !description) return
    setSaving(true)
    try {
      await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, title, year, category, description }),
      })
      setOpen(false)
      setTitle(''); setYear(''); setDescription('')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', border: '1.5px solid var(--light-gray)',
    borderRadius: 12, fontSize: 14, background: 'var(--cream)', outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
  }

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        background: 'linear-gradient(135deg, #9B8EC4, #6BB5A0)', color: 'white',
        border: 'none', borderRadius: 12, padding: '12px 22px', fontSize: 14, fontWeight: 500,
        cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
      }}>
        + Add Memory
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(44,40,37,0.5)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div style={{ background: 'white', borderRadius: 28, padding: 36, width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(44,40,37,0.25)' }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 500, marginBottom: 6 }}>Add a Memory</h2>
            <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 24, fontWeight: 300 }}>Share a cherished story or moment.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Our trip to Maine…" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Year</label>
                  <input value={year} onChange={e => setYear(e.target.value)} placeholder="1968" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                    <option value="family">Family</option>
                    <option value="travel">Travel</option>
                    <option value="milestone">Milestone</option>
                    <option value="garden">Garden</option>
                    <option value="holiday">Holiday</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Story</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this memory…" style={{ ...inputStyle, resize: 'none', height: 100 }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setOpen(false)} style={{ flex: 1, background: 'var(--cream)', border: '1.5px solid var(--light-gray)', borderRadius: 12, padding: '12px', fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Cancel
                </button>
                <button onClick={save} disabled={saving || !title || !description} style={{
                  flex: 2, background: '#7B6BC4', color: 'white', border: 'none',
                  borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: saving || !title || !description ? 0.7 : 1,
                }}>
                  {saving ? 'Saving…' : 'Save Memory ✨'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
