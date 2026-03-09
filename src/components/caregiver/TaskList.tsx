'use client'
import { useState } from 'react'

interface Task {
  id: string
  text: string
  time: string
  done: boolean
}

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)

  function toggle(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {tasks.map(task => (
        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', background: 'var(--cream)', borderRadius: 10 }}>
          <div
            onClick={() => toggle(task.id)}
            style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0, cursor: 'pointer',
              background: task.done ? 'var(--sage)' : 'transparent',
              border: task.done ? 'none' : '2px solid var(--light-gray)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 11, fontWeight: 700, transition: 'all 0.15s',
            }}
          >{task.done ? '✓' : ''}</div>
          <div style={{ flex: 1, fontSize: 14, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--warm-gray)' : 'var(--charcoal)', transition: 'all 0.15s' }}>
            {task.text}
          </div>
          <div style={{ fontSize: 12, color: 'var(--warm-gray)' }}>{task.time}</div>
        </div>
      ))}
      {tasks.length === 0 && (
        <p style={{ fontSize: 14, color: 'var(--warm-gray)' }}>No tasks scheduled for today.</p>
      )}
    </div>
  )
}
