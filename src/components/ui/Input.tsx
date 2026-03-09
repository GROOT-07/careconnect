import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="w-full">
      {label && <label htmlFor={id} className="label">{label}</label>}
      <input ref={ref} id={id} className={cn('input', error && 'border-terra', className)} {...props} />
      {error && <p className="text-xs text-terra mt-1">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
