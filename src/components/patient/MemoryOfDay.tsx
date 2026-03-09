'use client'
import { useState } from 'react'
import { MemoryDetail } from '../family/MemoryDetail'

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

export function MemoryOfDay({ memory }: { memory: Memory }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          background: `linear-gradient(135deg, ${memory.color1 || '#C4A882'}, ${memory.color2 || '#8A6840'})`,
          borderRadius: 20, padding: '20px 22px', cursor: 'pointer', color: 'white',
        }}
      >
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', opacity: 0.8, marginBottom: 8 }}>Memory of the Day</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{memory.title}</div>
        {memory.year && <div style={{ fontSize: 13, opacity: 0.8 }}>{memory.year}</div>}
        <div style={{ fontSize: 13, marginTop: 12, opacity: 0.9, lineHeight: 1.5 }}>
          {memory.description.slice(0, 100)}…
        </div>
        <div style={{ fontSize: 12, marginTop: 12, opacity: 0.7 }}>Tap to explore this memory →</div>
      </div>
      {open && <MemoryDetail memory={memory} onClose={() => setOpen(false)} clientName="Eleanor" />}
    </>
  )
}
