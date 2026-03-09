interface CardProps {
  title: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export function Card({ title, children, style }: CardProps) {
  return (
    <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-sm)', ...style }}>
      {title && (
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 500, color: 'var(--charcoal)', marginBottom: 18, letterSpacing: '-0.3px' }}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}
