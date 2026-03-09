'use client'
import { useState } from 'react'

interface Memory {
  id: string
  title: string
  year: string | number | null
  category: string | null
  description: string
  color1: string | null
  color2: string | null
  aiEnhanced: string | null
}

interface Props {
  memory: Memory
  clientName: string
  onClose: () => void
  interactive?: boolean
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function MemoryDetail({ memory, clientName, onClose, interactive }: Props) {
  const [enhanced, setEnhanced] = useState(memory.aiEnhanced)
  const [enhancing, setEnhancing] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  async function enhance() {
    setEnhancing(true)
    try {
      const res = await fetch('/api/memory-bloom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'enhance', memoryId: memory.id, clientName }),
      })
      const data = await res.json()
      setEnhanced(data.enhanced)
    } finally {
      setEnhancing(false)
    }
  }

  async function sendMessage() {
    if (!chatInput.trim() || chatLoading) return
    const msg = chatInput.trim()
    setChatInput('')
    const newHistory = [...chatMessages, { role: 'user' as const, content: msg }]
    setChatMessages(newHistory)
    setChatLoading(true)
    try {
      const res = await fetch('/api/memory-bloom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', memoryId: memory.id, message: msg, history: chatMessages }),
      })
      const data = await res.json()
      setChatMessages([...newHistory, { role: 'assistant', content: data.response }])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(44,40,37,0.5)', backdropFilter: 'blur(6px)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'white', borderRadius: 28, width: '100%', maxWidth: 760, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(44,40,37,0.25)' }}>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${memory.color1 || '#C4A882'}, ${memory.color2 || '#8A6840'})`, padding: '28px 28px 24px', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(44,40,37,0.3))' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'white', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>
              {memory.year}{memory.category ? ` · ${memory.category}` : ''}
            </div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 500, color: 'white', lineHeight: 1.15 }}>{memory.title}</h2>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: interactive ? '1fr 1fr' : '1fr', gap: 24 }}>

            {/* Memory content */}
            <div>
              {enhanced ? (
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--warm-gray)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    ✨ AI Enhanced Story
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, rgba(155,142,196,0.08), rgba(107,181,160,0.08))', borderRadius: 16, padding: 18 }}>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--charcoal)', fontWeight: 300 }}>{enhanced}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--warm-gray)', marginBottom: 10 }}>Memory</div>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--charcoal)', fontWeight: 300, marginBottom: 16 }}>{memory.description}</p>
                  <button onClick={enhance} disabled={enhancing} style={{
                    background: 'linear-gradient(135deg, #9B8EC4, #6BB5A0)', color: 'white', border: 'none',
                    padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif', opacity: enhancing ? 0.7 : 1,
                  }}>
                    {enhancing ? 'Enhancing with AI…' : '✨ Enhance with AI'}
                  </button>
                </div>
              )}
            </div>

            {/* AI Chat (patient only) */}
            {interactive && (
              <div style={{ display: 'flex', flexDirection: 'column', height: 320 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--warm-gray)', marginBottom: 10 }}>Talk About This Memory 💬</div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12, padding: '4px 0' }}>
                  {chatMessages.length === 0 && (
                    <div style={{ fontSize: 13, color: 'var(--warm-gray)', fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>
                      Share your thoughts about this memory…
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} style={{
                      maxWidth: '85%', padding: '10px 14px', fontSize: 14, lineHeight: 1.5,
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.role === 'user' ? '#7B6BC4' : 'var(--cream)',
                      color: msg.role === 'user' ? 'white' : 'var(--charcoal)',
                      borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    }}>{msg.content}</div>
                  ))}
                  {chatLoading && (
                    <div style={{ fontSize: 13, color: 'var(--warm-gray)', fontStyle: 'italic' }}>Thinking…</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your thoughts…"
                    style={{ flex: 1, border: '1.5px solid var(--light-gray)', borderRadius: 100, padding: '10px 16px', fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif', background: 'var(--cream)' }}
                  />
                  <button onClick={sendMessage} style={{ background: '#7B6BC4', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: 16 }}>→</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
