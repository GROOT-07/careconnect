'use client'
import { useState } from 'react'
import { MemoryDetail } from './MemoryDetail'

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

interface MemoryGridProps {
  memories: Memory[]
  clientName: string
  interactive?: boolean
}

export function MemoryGrid({ memories, clientName, interactive = false }: MemoryGridProps) {
  const [selected, setSelected] = useState<Memory | null>(null)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {memories.map(memory => (
          <div
            key={memory.id}
            onClick={() => setSelected(memory)}
            style={{
              borderRadius: 18, overflow: 'hidden', aspectRatio: '1',
              background: `linear-gradient(135deg, ${memory.color1 || '#C4A882'}, ${memory.color2 || '#8A6840'})`,
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: 16, cursor: 'pointer', position: 'relative',
              transition: 'transform 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseOut={e => (e.currentTarget.style.transform = '')}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,40,37,0.6) 0%, transparent 60%)' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 3 }}>
                {memory.year}{memory.category ? ` · ${memory.category}` : ''}
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 16, color: 'white', fontWeight: 500, lineHeight: 1.3 }}>
                {memory.title}
              </div>
            </div>
          </div>
        ))}

        {/* Add memory tile */}
        <div style={{
          borderRadius: 18, aspectRatio: '1',
          background: 'linear-gradient(135deg, #6BB5A0, #4A8070)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'transform 0.2s',
        }}
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseOut={e => (e.currentTarget.style.transform = '')}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>+</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Add Memory</div>
          </div>
        </div>
      </div>

      {selected && (
        <MemoryDetail
          memory={selected}
          clientName={clientName}
          onClose={() => setSelected(null)}
          interactive={interactive}
        />
      )}
    </>
  )
}
