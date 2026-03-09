interface Alert {
  type: 'warning' | 'info' | 'success'
  icon: string
  title: string
  desc: string
}

const ALERT_STYLES = {
  warning: { bg: 'rgba(196,114,74,0.1)', border: '3px solid var(--terra)' },
  info: { bg: 'rgba(123,158,199,0.1)', border: '3px solid var(--sky)' },
  success: { bg: 'rgba(139,175,141,0.1)', border: '3px solid var(--sage)' },
}

export function AlertList({ alerts }: { alerts: Alert[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {alerts.map((alert, i) => (
        <div key={i} style={{
          display: 'flex', gap: 12, alignItems: 'flex-start',
          padding: '12px 14px', borderRadius: 12,
          background: ALERT_STYLES[alert.type].bg,
          borderLeft: ALERT_STYLES[alert.type].border,
        }}>
          <div style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{alert.icon}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)', marginBottom: 2 }}>{alert.title}</div>
            <div style={{ fontSize: 12, color: 'var(--warm-gray)', lineHeight: 1.5 }}>{alert.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
