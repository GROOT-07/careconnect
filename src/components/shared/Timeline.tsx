import { cn } from '@/lib/utils'

interface TimelineItem {
  title: string
  meta: string
  color?: string
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="flex flex-col gap-0">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4 pb-5 last:pb-0">
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ background: item.color || '#8BAF8D' }} />
            {i < items.length - 1 && <div className="w-0.5 flex-1 bg-light-gray mt-1" />}
          </div>
          <div className="flex-1 pb-1">
            <p className="text-sm font-medium text-[#2C2825]">{item.title}</p>
            <p className="text-xs text-warm-gray mt-0.5">{item.meta}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
