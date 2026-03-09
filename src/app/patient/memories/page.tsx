'use client'
import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface Memory { id: string; title: string; year?: number; category?: string; color?: string; description: string }
interface ChatMsg { role: string; content: string }

export default function PatientMemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [selected, setSelected] = useState<Memory | null>(null)
  const [chat, setChat] = useState<ChatMsg[]>([])
  const [msg, setMsg] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetch('/api/memories?clientId=client-eleanor').then(r => r.json()).then(setMemories)
  }, [])

  async function openMemory(m: Memory) {
    setSelected(m)
    const r = await fetch(`/api/memories/${m.id}`)
    const data = await r.json()
    setChat(data.chatHistory || [])
    // Add a welcoming opening message
    if (!data.chatHistory?.length) {
      setSending(true)
      const r2 = await fetch(`/api/memories/${m.id}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Hello! I'd love to hear about "${m.title}". Can you tell me more about it?` }),
      })
      const d2 = await r2.json()
      setChat([
        { role: 'user', content: `Hello! I'd love to hear about "${m.title}". Can you tell me more about it?` },
        { role: 'assistant', content: d2.message }
      ])
      setSending(false)
    }
  }

  async function sendMessage() {
    if (!msg.trim() || !selected) return
    const userMsg = msg.trim()
    setMsg('')
    setChat(c => [...c, { role: 'user', content: userMsg }])
    setSending(true)
    const r = await fetch(`/api/memories/${selected.id}/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg }),
    })
    const data = await r.json()
    setChat(c => [...c, { role: 'assistant', content: data.message }])
    setSending(false)
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">My Memories 🌸</h1>
      <p className="text-warm-gray font-light mb-8">Your cherished life stories. Tap any to explore with your companion.</p>

      <div className="grid grid-cols-3 gap-5">
        {memories.map(m => (
          <div key={m.id} onClick={() => openMemory(m)}
            className="relative rounded-3xl overflow-hidden aspect-square cursor-pointer group transition-all hover:scale-[1.03] hover:shadow-xl">
            <div className="absolute inset-0" style={{ background: m.color || 'linear-gradient(135deg,#C4A882,#8A6840)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-xs text-white/70 mb-1">{m.year} · {m.category}</p>
              <p className="font-fraunces text-xl text-white font-medium leading-tight">{m.title}</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <span className="bg-white/25 backdrop-blur-sm text-white text-sm font-medium px-5 py-2.5 rounded-full">Talk about this 💬</span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} className="max-w-lg" title={selected?.title}>
        {selected && (
          <div>
            <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg,rgba(155,142,196,0.12),rgba(107,181,160,0.08))' }}>
              <p className="text-xs font-medium text-warm-gray mb-1">{selected.year} · {selected.category}</p>
              <p className="text-sm text-[#2C2825] leading-relaxed">{selected.description}</p>
            </div>
            <div className="bg-[#F5F0FA] rounded-2xl p-4 h-64 overflow-y-auto flex flex-col gap-3 mb-3">
              {chat.map((c, i) => (
                <div key={i} className={`flex gap-2 ${c.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${c.role === 'user' ? 'bg-[#7B6BC4] text-white text-xs font-semibold' : 'bg-white text-base shadow-sm'}`}>
                    {c.role === 'user' ? 'E' : '🌸'}
                  </div>
                  <div className={`text-sm rounded-2xl px-4 py-2.5 max-w-[82%] leading-relaxed ${c.role === 'user' ? 'bg-[#7B6BC4] text-white rounded-tr-sm' : 'bg-white text-[#2C2825] rounded-tl-sm shadow-sm'}`}>
                    {c.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-sm">🌸</div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 text-warm-gray text-sm shadow-sm">
                    <span className="inline-flex gap-1">
                      {[0,1,2].map(i => <span key={i} className="animate-bounce" style={{animationDelay:`${i*0.1}s`}}>·</span>)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input className="input flex-1 text-sm" value={msg} onChange={e => setMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Tell me more, or ask something…" />
              <Button size="sm" onClick={sendMessage} loading={sending} className="px-4 rounded-xl" style={{ background: '#7B6BC4' }}>→</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
