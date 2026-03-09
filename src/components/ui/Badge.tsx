import { cn } from '@/lib/utils'

const variants = {
  sage: 'bg-sage-light text-sage-dark',
  terra: 'bg-terra-light text-terra',
  sky: 'bg-sky-light text-sky',
  sand: 'bg-sand/20 text-[#8A6840]',
  lavender: 'bg-purple-100 text-purple-700',
  default: 'bg-light-gray text-warm-gray',
}

export function Badge({ children, variant = 'default', className }: {
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
}) {
  return (
    <span className={cn('pill', variants[variant], className)}>
      {children}
    </span>
  )
}
