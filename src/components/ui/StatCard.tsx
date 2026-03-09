interface StatCardProps {
  label: string
  value: string | number
  icon?: string
  color?: string
  delta?: string
  deltaType?: 'up' | 'down' | 'neutral'
}

export function StatCard({ label, value, icon, delta, deltaType = 'neutral' }: StatCardProps) {
  const deltaColor = deltaType === 'up' ? 'var(--sage-dark)' : deltaType === 'down' ? 'var(--terra)' : 'var(--warm-gray)'
  const deltaPrefix = deltaType === 'up' ? '↑ ' : deltaType === 'down' ? '↓ ' : ''

  return (
    <div style={{ background: 'white', borderRadius: 18, padding: '20px 22px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--warm-gray)', marginBottom: 10 }}>
        {icon && <span style={{ marginRight: 6 }}>{icon}</span>}{label}
      </div>
      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 500, color: 'var(--charcoal)', lineHeight: 1 }}>{value}</div>
      {delta && (
        <div style={{ fontSize: 12, marginTop: 8, color: deltaColor }}>{deltaPrefix}{delta}</div>
      )}
    </div>
  )
}
