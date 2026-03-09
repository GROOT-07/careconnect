import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      danger: 'btn-danger',
      ghost: 'bg-transparent text-warm-gray hover:bg-cream rounded-lg px-3 py-2 text-sm',
    }
    const sizes = { sm: 'text-xs px-4 py-2', md: 'text-sm', lg: 'text-base px-8 py-4' }
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
        {loading ? <span className="animate-spin mr-2">⟳</span> : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
