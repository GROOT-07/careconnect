import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  className?: string
}

export function StatCard({ label, value, delta, deltaUp, className }: StatCardProps) {
  return (
    <div className={cn('stat-card', className)}>
      <p className="text-xs uppercase tracking-wide text-warm-gray font-medium">{label}</p>
      <p className="font-fraunces text-4xl font-medium text-[#2C2825] leading-none mt-1">{value}</p>
      {delta && (
        <p className={cn('text-xs mt-2 flex items-center gap-1', deltaUp ? 'text-sage-dark' : 'text-terra')}>
          {deltaUp ? '↑' : '↓'} {delta}
        </p>
      )}
    </div>
  )
}
