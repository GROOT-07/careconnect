interface TimelineItem {
  title: string
  meta: string
  color?: string
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < items.length - 1 ? 20 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color || 'var(--sage)', flexShrink: 0, marginTop: 4 }} />
            {i < items.length - 1 && <div style={{ flex: 1, width: 2, background: 'var(--light-gray)', marginTop: 4 }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--charcoal)', marginBottom: 2 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: 'var(--warm-gray)' }}>{item.meta}</div>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p style={{ fontSize: 14, color: 'var(--warm-gray)' }}>No recent activity.</p>
      )}
    </div>
  )
}
