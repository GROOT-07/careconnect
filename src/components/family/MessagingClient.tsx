'use client'
import { useState } from 'react'

interface Message {
  id: string
  content: string
  sentAt: string
  senderName: string
  senderId: string
  isOwn: boolean
}

interface Props {
  initialMessages: Message[]
  caregiverName: string
  clientId: string
  userId: string
}

export function MessagingClient({ initialMessages, caregiverName, clientId, userId }: Props) {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  async function send() {
    if (!input.trim() || sending) return
    const content = input.trim()
    setInput('')
    setSending(true)
    try {
      const res = await fetch('/api/clients/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, content }),
      })
      const msg = await res.json()
      setMessages(prev => [...prev, msg])
    } finally {
      setSending(false)
    }
  }

  const caregiverInitial = caregiverName[0]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
      {/* Sidebar */}
      <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--light-gray)', fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 500 }}>
          Conversations
        </div>
        <div style={{ padding: '14px 20px', background: 'var(--cream)', display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontSize: 16, color: 'white' }}>
            {caregiverInitial}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{caregiverName}</div>
            <div style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 2 }}>
              {messages[messages.length - 1]?.content.slice(0, 30)}…
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', minHeight: 500 }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 500, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--light-gray)' }}>
          {caregiverName}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: msg.isOwn ? 'flex-end' : 'flex-start',
            }}>
              {!msg.isOwn && (
                <div style={{ fontSize: 11, color: 'var(--warm-gray)', marginBottom: 4, marginLeft: 4 }}>{msg.senderName}</div>
              )}
              <div style={{
                maxWidth: '70%', padding: '11px 16px',
                borderRadius: msg.isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.isOwn ? 'var(--sage-dark)' : 'var(--cream)',
                color: msg.isOwn ? 'white' : 'var(--charcoal)',
                fontSize: 14, lineHeight: 1.5,
              }}>
                {msg.content}
              </div>
              <div style={{ fontSize: 11, color: 'var(--warm-gray)', marginTop: 3 }}>
                {new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid var(--light-gray)' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message…"
            style={{ flex: 1, border: '1.5px solid var(--light-gray)', borderRadius: 100, padding: '12px 18px', fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif', background: 'var(--cream)' }}
          />
          <button onClick={send} disabled={sending} style={{
            background: 'var(--sage-dark)', color: 'white', border: 'none',
            borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', fontSize: 18,
            flexShrink: 0, opacity: sending ? 0.7 : 1,
          }}>→</button>
        </div>
      </div>
    </div>
  )
}
