'use client'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useEffect } from 'react'

export function Modal({ open, onClose, title, children, className }: {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#2C2825]/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-slide-up', className)}>
        <div className="flex items-start justify-between mb-6">
          {title && <h2 className="font-fraunces text-2xl font-medium">{title}</h2>}
          <button onClick={onClose} className="ml-auto text-warm-gray hover:text-[#2C2825] transition-colors p-1 rounded-lg hover:bg-cream">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
