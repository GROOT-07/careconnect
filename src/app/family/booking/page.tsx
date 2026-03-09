'use client'
import { useState, useEffect } from 'react'
import { formatDate, formatTime, SERVICE_LABELS } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function FamilyBookingPage() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    const r = await fetch('/api/bookings')
    const data = await r.json()
    setBookings(data)
  }

  async function bookSlot(time: string, service: string) {
    setLoading(true)
    try {
      const dt = new Date(selectedDate)
      const [h, m] = time.split(':')
      dt.setHours(parseInt(h), parseInt(m), 0, 0)
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: 'client-eleanor', serviceType: service, scheduledAt: dt.toISOString(), durationMins: 60 }),
      })
      toast('Visit booked successfully! ✅')
      fetchBookings()
    } finally {
      setLoading(false)
    }
  }

  const slots = [
    { time: '09:00', label: 'Morning Care Visit', service: 'MORNING_CARE', caregiver: 'Maria Chen', duration: '2 hrs' },
    { time: '11:30', label: 'Companionship & Activities', service: 'COMPANIONSHIP', caregiver: 'James Osei', duration: '1.5 hrs' },
    { time: '14:00', label: 'Afternoon Care + Meds', service: 'MEDICATION', caregiver: 'Maria Chen', duration: '1 hr' },
    { time: '17:00', label: 'Evening Meal Prep', service: 'MEAL_PREP', caregiver: 'Priya Nair', duration: '1 hr' },
    { time: '19:30', label: 'Bedtime Routine Assist', service: 'EVENING_ROUTINE', caregiver: 'Maria Chen', duration: '45 min' },
  ]

  // Calendar
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay()

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">Book a Care Visit</h1>
        <p className="text-warm-gray font-light">Select a date and available time slot.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-fraunces text-xl font-medium">
              {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-cream hover:bg-sage-light transition-colors text-sm">‹</button>
              <button className="w-8 h-8 rounded-full bg-cream hover:bg-sage-light transition-colors text-sm">›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center mb-2">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-xs text-warm-gray font-medium py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1
              const isToday = day === now.getDate()
              const isSelected = day === selectedDate.getDate()
              return (
                <button key={day}
                  onClick={() => { const d = new Date(now); d.setDate(day); setSelectedDate(d) }}
                  className={`aspect-square rounded-xl text-sm transition-all flex items-center justify-center
                    ${isSelected ? 'bg-sage-dark text-white font-medium' : isToday ? 'border-2 border-sage font-semibold' : 'hover:bg-sage-light'}`}>
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Slots */}
        <div className="card">
          <h3 className="font-fraunces text-xl font-medium mb-4">
            Available Slots — <span className="text-sage-dark">{formatDate(selectedDate)}</span>
          </h3>
          <div className="flex flex-col gap-3">
            {slots.map(slot => {
              const booked = bookings.some((b: Record<string, unknown>) => {
                const ba = b as { scheduledAt?: string; serviceType?: string }
                return ba.scheduledAt && new Date(ba.scheduledAt).toDateString() === selectedDate.toDateString() &&
                  ba.serviceType === slot.service
              })
              return (
                <div key={slot.time} className={`flex items-center gap-4 p-4 rounded-2xl transition-all border-2 ${booked ? 'border-sage bg-sage-light/20' : 'border-light-gray hover:border-sage-light'}`}>
                  <div className="text-center min-w-[56px]">
                    <p className="font-fraunces text-lg font-medium">{slot.time}</p>
                    <p className="text-xs text-warm-gray">{slot.time < '12:00' ? 'AM' : 'PM'}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{slot.label}</p>
                    <p className="text-xs text-warm-gray mt-0.5">{slot.caregiver} · {slot.duration}</p>
                  </div>
                  {booked ? (
                    <span className="pill bg-sage-light text-sage-dark">✓ Booked</span>
                  ) : (
                    <Button size="sm" onClick={() => bookSlot(slot.time, slot.service)} loading={loading} className="rounded-full">
                      Book
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Upcoming bookings */}
      <div className="card mt-6">
        <h3 className="font-fraunces text-xl font-medium mb-4">Upcoming Visits</h3>
        {bookings.length === 0 ? (
          <p className="text-sm text-warm-gray">No upcoming visits booked.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-light-gray">
                <th className="text-left py-3 px-2 text-xs uppercase tracking-wide text-warm-gray font-medium">Date & Time</th>
                <th className="text-left py-3 px-2 text-xs uppercase tracking-wide text-warm-gray font-medium">Service</th>
                <th className="text-left py-3 px-2 text-xs uppercase tracking-wide text-warm-gray font-medium">Caregiver</th>
                <th className="text-left py-3 px-2 text-xs uppercase tracking-wide text-warm-gray font-medium">Status</th>
              </tr></thead>
              <tbody>
                {bookings.map((b: Record<string, unknown>) => {
                  const booking = b as { id: string; scheduledAt: string; serviceType: string; status: string; caregiver?: { user?: { name?: string } } }
                  return (
                    <tr key={booking.id} className="border-b border-light-gray/50 hover:bg-cream transition-colors">
                      <td className="py-3 px-2">{formatDate(booking.scheduledAt)} · {formatTime(booking.scheduledAt)}</td>
                      <td className="py-3 px-2">{SERVICE_LABELS[booking.serviceType] || booking.serviceType}</td>
                      <td className="py-3 px-2">{booking.caregiver?.user?.name || '—'}</td>
                      <td className="py-3 px-2"><span className="pill bg-sage-light text-sage-dark">{booking.status}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
