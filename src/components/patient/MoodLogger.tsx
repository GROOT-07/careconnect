'use client'
import { useState } from 'react'

const MOODS = [
  { mood: 'happy', emoji: '😊', label: 'Happy' },
  { mood: 'calm', emoji: '😌', label: 'Calm' },
  { mood: 'tired', emoji: '😴', label: 'Tired' },
  { mood: 'worried', emoji: '😟', label: 'Worried' },
  { mood: 'sad', emoji: '😢', label: 'Sad' },
]

export function MoodLogger({ clientId, currentMood }: { clientId: string; currentMood?: string }) {
  const [selected, setSelected] = useState(currentMood || '')
  const [saved, setSaved] = useState(false)

  async function logMood(mood: string, emoji: string) {
    setSelected(mood)
    await fetch('/api/clients/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, mood, emoji }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {MOODS.map(({ mood, emoji, label }) => (
          <button
            key={mood}
            onClick={() => logMood(mood, emoji)}
            title={label}
            style={{
              padding: '10px 16px', borderRadius: 100, fontSize: 22, cursor: 'pointer',
              border: `2px solid ${selected === mood ? '#7B6BC4' : 'var(--light-gray)'}`,
              background: selected === mood ? 'rgba(123,107,196,0.1)' : 'transparent',
              transition: 'all 0.15s',
            }}
          >{emoji}</button>
        ))}
      </div>
      {saved && (
        <div style={{ fontSize: 13, color: 'var(--sage-dark)', marginTop: 10 }}>✓ Mood logged, thank you!</div>
      )}
    </div>
  )
}
