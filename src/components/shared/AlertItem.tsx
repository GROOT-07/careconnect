import { cn } from '@/lib/utils'

type AlertVariant = 'warning' | 'info' | 'success'
const styles: Record<AlertVariant, string> = {
  warning: 'bg-terra-light/60 border-l-4 border-terra',
  info: 'bg-sky-light/60 border-l-4 border-sky',
  success: 'bg-sage-light/60 border-l-4 border-sage-dark',
}
const icons: Record<AlertVariant, string> = { warning: '⚠️', info: 'ℹ️', success: '✅' }

export function AlertItem({ title, description, variant = 'info' }: { title: string; description: string; variant?: AlertVariant }) {
  return (
    <div className={cn('flex gap-3 p-3 rounded-xl mb-3', styles[variant])}>
      <span className="text-base flex-shrink-0 mt-0.5">{icons[variant]}</span>
      <div>
        <p className="text-sm font-medium text-[#2C2825]">{title}</p>
        <p className="text-xs text-warm-gray mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
