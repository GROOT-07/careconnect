'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'
interface Toast { id: string; message: string; type: ToastType }
interface ToastContextValue { toast: (message: string, type?: ToastType) => void }

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36)
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[100]">
        {toasts.map(t => (
          <div key={t.id} className={cn('flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm animate-slide-up max-w-xs',
            t.type === 'success' && 'bg-sage-dark text-white',
            t.type === 'error' && 'bg-terra text-white',
            t.type === 'info' && 'bg-[#2C2825] text-white'
          )}>
            {t.type === 'success' && <CheckCircle size={16} />}
            {t.type === 'error' && <AlertCircle size={16} />}
            {t.type === 'info' && <Info size={16} />}
            {t.message}
            <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} className="ml-auto opacity-70 hover:opacity-100"><X size={14} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
