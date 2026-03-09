const STATUS_MAP: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: 'rgba(139,175,141,0.2)', color: 'var(--sage-dark)', label: 'Active' },
  priority: { bg: 'var(--terra-light)', color: 'var(--terra)', label: 'Priority' },
  monitoring: { bg: 'var(--sky-light)', color: '#4A72A0', label: 'Monitoring' },
  new: { bg: 'rgba(212,184,150,0.25)', color: '#8A6840', label: 'New' },
  confirmed: { bg: 'rgba(139,175,141,0.2)', color: 'var(--sage-dark)', label: 'Confirmed' },
  pending: { bg: 'rgba(212,184,150,0.25)', color: '#8A6840', label: 'Pending' },
  completed: { bg: 'rgba(139,175,141,0.2)', color: 'var(--sage-dark)', label: 'Completed' },
  cancelled: { bg: 'var(--terra-light)', color: 'var(--terra)', label: 'Cancelled' },
}

export function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_MAP[status.toLowerCase()] || { bg: 'var(--light-gray)', color: 'var(--warm-gray)', label: status }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500, background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}
