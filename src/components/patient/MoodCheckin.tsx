'use client'
import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'

const moods = ['😟', '😔', '😌', '😊', '🥰']

export function MoodCheckin({ clientId }: { clientId: string }) {
  const { toast } = useToast()
  const [selected, setSelected] = useState<number | null>(null)

  async function submit(mood: number) {
    setSelected(mood)
    await fetch('/api/mood', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, mood: mood + 1 }),
    })
    toast('Mood recorded, thank you! 🌸')
  }

  return (
    <div className="card">
      <h3 className="font-fraunces text-xl font-medium mb-4">How are you feeling? 💭</h3>
      <div className="flex gap-3">
        {moods.map((m, i) => (
          <button key={i} onClick={() => submit(i)}
            className={`flex-1 py-3 rounded-2xl text-2xl transition-all hover:scale-110 border-2 ${selected === i ? 'border-[#9B8EC4] bg-[#9B8EC4]/10 scale-110' : 'border-light-gray hover:border-[#9B8EC4]/50'}`}>
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}
