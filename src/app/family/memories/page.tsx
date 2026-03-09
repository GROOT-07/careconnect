'use client'
import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { getInitials } from '@/lib/utils'

interface Memory { id: string; title: string; year?: number; category?: string; color?: string; description: string }
interface ChatMsg { role: string; content: string }

export default function FamilyMemoriesPage() {
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
  }

  async function sendMessage() {
    if (!msg.trim() || !selected) return
    const userMsg = msg.trim()
    setMsg('')
    setChat(c => [...c, { role: 'user', content: userMsg }])
    setSending(true)
    try {
      const r = await fetch(`/api/memories/${selected.id}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      })
      const data = await r.json()
      setChat(c => [...c, { role: 'assistant', content: data.message }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">Memory Bloom 🌸</h1>
        <p className="text-warm-gray font-light">Eleanor's collection of cherished life stories and memories.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {memories.map(m => (
          <div key={m.id}
            onClick={() => openMemory(m)}
            className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer group transition-transform hover:scale-[1.02]"
            style={{ background: m.color || 'linear-gradient(135deg,#C4A882,#8A6840)' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xs text-white/70 mb-1">{m.year} · {m.category}</p>
              <p className="font-fraunces text-lg text-white font-medium">{m.title}</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">Explore Memory 💬</span>
            </div>
          </div>
        ))}
        <button className="rounded-2xl aspect-square border-2 border-dashed border-sand/50 flex flex-col items-center justify-center gap-2 text-warm-gray hover:border-sage hover:text-sage-dark transition-all group">
          <span className="text-3xl group-hover:scale-110 transition-transform">+</span>
          <span className="text-sm font-medium">Add Memory</span>
        </button>
      </div>

      {/* Memory Chat Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} className="max-w-lg" title={selected?.title || ''}>
        {selected && (
          <div>
            <div className="rounded-xl p-4 mb-4" style={{ background: selected.color ? selected.color.replace(')', ',0.12)').replace('gradient', 'linear-gradient') : '#FAF7F2' }}>
              <p className="text-xs text-warm-gray mb-1 font-medium">{selected.year} · {selected.category}</p>
              <p className="text-sm text-[#2C2825] leading-relaxed">{selected.description}</p>
            </div>
            <p className="text-xs text-warm-gray mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sage-dark" /> AI companion — ask questions to explore this memory deeper
            </p>
            <div className="bg-cream rounded-2xl p-4 h-56 overflow-y-auto flex flex-col gap-3 mb-3">
              {chat.length === 0 && (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <p className="text-2xl mb-2">💭</p>
                    <p className="text-sm text-warm-gray">Ask a question to explore this memory…</p>
                    <p className="text-xs text-warm-gray/70 mt-1">e.g. "What did the lighthouse look like?"</p>
                  </div>
                </div>
              )}
              {chat.map((c, i) => (
                <div key={i} className={`flex gap-3 ${c.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white font-medium ${c.role === 'user' ? 'bg-sky' : 'bg-sage-dark'}`}>
                    {c.role === 'user' ? 'S' : '🌸'}
                  </div>
                  <div className={`text-sm rounded-2xl px-3 py-2 max-w-[80%] leading-relaxed ${c.role === 'user' ? 'bg-sky text-white rounded-tr-sm' : 'bg-white text-[#2C2825] rounded-tl-sm shadow-sm'}`}>
                    {c.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-sage-dark flex items-center justify-center text-xs">🌸</div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-warm-gray text-sm shadow-sm">
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">·</span>
                      <span className="animate-bounce" style={{animationDelay:'0.1s'}}>·</span>
                      <span className="animate-bounce" style={{animationDelay:'0.2s'}}>·</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input className="input flex-1" value={msg} onChange={e => setMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about this memory…" />
              <Button size="sm" onClick={sendMessage} loading={sending} className="px-4 rounded-xl">→</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
