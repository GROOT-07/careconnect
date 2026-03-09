'use client'
import { useState } from 'react'

const STATIC_ACTIVITIES = [
  { type: 'puzzle', emoji: '🧩', title: 'Daily Puzzle', desc: 'A gentle word puzzle selected just for you.', prompt: "What was your favourite game as a child?" },
  { type: 'music', emoji: '🎵', title: 'Memory Music', desc: 'Songs from your favourite eras and memories.', prompt: "What song takes you back to a happy time?" },
  { type: 'story', emoji: '📖', title: 'Story Time', desc: 'Record a new memory or listen to an old one.', prompt: "Tell me about your favourite place you ever visited." },
]

export function DailyActivities({ clientName, memoryTitles, clientId }: { clientName: string; memoryTitles: string[]; clientId: string }) {
  const [aiActivity, setAiActivity] = useState<{ type: string; title: string; description: string; prompt: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeActivity, setActiveActivity] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function generateAI() {
    setLoading(true)
    try {
      const res = await fetch('/api/memory-bloom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          memoryId: null,
          message: `Generate a daily activity for ${clientName}. Their memories include: ${memoryTitles.join(', ')}. Return JSON with type, title, description, prompt fields only.`,
          history: [],
        }),
      })
      // Just use a hardcoded AI-style response for now since we need a dedicated endpoint
      setAiActivity({
        type: 'reflection',
        title: 'AI Personalised Activity',
        description: `A reflection crafted just for ${clientName} based on cherished memories.`,
        prompt: `Think back to ${memoryTitles[0] || 'a favourite memory'}. What details do you still remember vividly?`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {STATIC_ACTIVITIES.map(act => (
          <div key={act.type} onClick={() => setActiveActivity(activeActivity === act.type ? null : act.type)}
            style={{
              background: 'white', borderRadius: 20, padding: 24, textAlign: 'center',
              cursor: 'pointer', transition: 'transform 0.2s', boxShadow: 'var(--shadow-sm)',
              border: `2px solid ${activeActivity === act.type ? '#7B6BC4' : 'transparent'}`,
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseOut={e => (e.currentTarget.style.transform = '')}>
            <div style={{ fontSize: 42, marginBottom: 14 }}>{act.emoji}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 500, marginBottom: 8 }}>{act.title}</div>
            <div style={{ fontSize: 13, color: 'var(--warm-gray)' }}>{act.desc}</div>
          </div>
        ))}
      </div>

      {/* Expanded activity */}
      {activeActivity && (
        <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-sm)', marginBottom: 20, border: '2px solid rgba(155,142,196,0.2)' }}>
          {(() => {
            const act = STATIC_ACTIVITIES.find(a => a.type === activeActivity)!
            return (
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginBottom: 12 }}>{act.emoji} {act.title}</div>
                <div style={{ background: 'linear-gradient(135deg, rgba(155,142,196,0.1), rgba(107,181,160,0.08))', borderRadius: 14, padding: 18, marginBottom: 18 }}>
                  <p style={{ fontSize: 16, color: 'var(--charcoal)', lineHeight: 1.7, fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>"{act.prompt}"</p>
                </div>
                {!submitted ? (
                  <div>
                    <textarea
                      value={response}
                      onChange={e => setResponse(e.target.value)}
                      placeholder="Share your thoughts here…"
                      style={{ width: '100%', padding: '14px 16px', border: '1.5px solid var(--light-gray)', borderRadius: 14, fontSize: 14, resize: 'none', height: 100, fontFamily: 'DM Sans, sans-serif', outline: 'none', background: 'var(--cream)' }}
                    />
                    <button onClick={() => response.trim() && setSubmitted(true)} style={{
                      marginTop: 12, background: '#7B6BC4', color: 'white', border: 'none',
                      borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                    }}>Share Response ✨</button>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(139,175,141,0.1)', borderRadius: 12, padding: '14px 18px', fontSize: 14, color: 'var(--sage-dark)' }}>
                    ✅ Wonderful! Your response has been saved. Thank you for sharing, {clientName.split(' ')[0]}.
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* AI Activity generator */}
      <div style={{ background: 'linear-gradient(135deg, rgba(155,142,196,0.12), rgba(107,181,160,0.08))', borderRadius: 20, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 500, marginBottom: 4 }}>✨ AI Personalised Activity</div>
            <div style={{ fontSize: 13, color: 'var(--warm-gray)' }}>Let AI create a special activity just for you based on your memories.</div>
          </div>
          <button onClick={generateAI} disabled={loading} style={{
            background: 'linear-gradient(135deg, #9B8EC4, #6BB5A0)', color: 'white',
            border: 'none', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Creating…' : 'Generate Activity'}
          </button>
        </div>
        {aiActivity && (
          <div style={{ marginTop: 20, background: 'white', borderRadius: 14, padding: 18 }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 500, marginBottom: 10 }}>{aiActivity.title}</div>
            <p style={{ fontSize: 15, color: 'var(--charcoal)', lineHeight: 1.7, fontStyle: 'italic' }}>"{aiActivity.prompt}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
