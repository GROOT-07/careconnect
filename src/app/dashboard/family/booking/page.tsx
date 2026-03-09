'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const SLOT_SERVICES = [
  { time: '09:00', ampm: 'AM', service: 'Morning Care Visit', caregiver: 'Maria Chen', duration: '2 hrs' },
  { time: '11:30', ampm: 'AM', service: 'Companionship & Activities', caregiver: 'James Osei', duration: '1.5 hrs' },
  { time: '14:00', ampm: 'PM', service: 'Afternoon Care + Meds', caregiver: 'Maria Chen', duration: '1 hr' },
  { time: '17:00', ampm: 'PM', service: 'Evening Meal Prep', caregiver: 'Priya Nair', duration: '1 hr' },
  { time: '19:30', ampm: 'PM', service: 'Bedtime Routine Assist', caregiver: 'Maria Chen', duration: '45 min' },
]

export default function FamilyBooking() {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set(['09:00']))
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function getDaysInMonth(m: number, y: number) { return new Date(y, m + 1, 0).getDate() }
  function getFirstDay(m: number, y: number) { return new Date(y, m, 1).getDay() }

  async function bookSlot(time: string, service: string, caregiver: string) {
    setLoading(true)
    try {
      const date = new Date(year, month, selectedDay)
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: date.toISOString(), serviceType: 'MORNING_CARE', durationMins: 60, clientId: 'placeholder' }),
      })
      if (res.ok) {
        setBookedSlots(prev => new Set([...prev, time]))
        setBookingSuccess(`${service} at ${time} booked successfully!`)
        setTimeout(() => setBookingSuccess(null), 4000)
      }
    } finally {
      setLoading(false)
    }
  }

  const daysInMonth = getDaysInMonth(month, year)
  const firstDay = getFirstDay(month, year)
  const calDays: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.5px' }}>Book a Care Visit</h1>
      <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32, fontWeight: 300 }}>Select a date and available time slot for the next care session.</p>

      {bookingSuccess && (
        <div style={{ background: 'rgba(139,175,141,0.15)', border: '1px solid var(--sage)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: 'var(--sage-dark)', display: 'flex', gap: 8 }}>
          ✅ {bookingSuccess}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
        {/* Calendar */}
        <Card title="">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500 }}>{MONTHS[month]} {year}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }}
                style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--cream)', border: 'none', cursor: 'pointer', fontSize: 16 }}>‹</button>
              <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }}
                style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--cream)', border: 'none', cursor: 'pointer', fontSize: 16 }}>›</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: 8 }}>
            {DAYS.map(d => <span key={d} style={{ fontSize: 11, color: 'var(--warm-gray)', fontWeight: 500, textTransform: 'uppercase', padding: '4px 0' }}>{d}</span>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
            {calDays.map((day, i) => (
              <div key={i} onClick={() => day && setSelectedDay(day)}
                style={{
                  aspectRatio: '1', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, cursor: day ? 'pointer' : 'default',
                  background: day === selectedDay ? 'var(--sage-dark)' : 'transparent',
                  color: day === selectedDay ? 'white' : day ? 'var(--charcoal)' : 'transparent',
                  fontWeight: day === today.getDate() && month === today.getMonth() ? 600 : 400,
                  border: day === today.getDate() && month === today.getMonth() && day !== selectedDay ? '2px solid var(--sage)' : '2px solid transparent',
                  transition: 'all 0.1s',
                }}>
                {day}
              </div>
            ))}
          </div>
        </Card>

        {/* Slots */}
        <Card title={`Available Slots — ${MONTHS[month].slice(0,3)} ${selectedDay}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SLOT_SERVICES.map(slot => {
              const booked = bookedSlots.has(slot.time)
              return (
                <div key={slot.time} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', background: booked ? 'rgba(139,175,141,0.1)' : 'var(--cream)',
                  borderRadius: 14, border: `2px solid ${booked ? 'var(--sage)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}>
                  <div style={{ textAlign: 'center', minWidth: 60 }}>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 500 }}>{slot.time}</div>
                    <div style={{ fontSize: 10, color: 'var(--warm-gray)' }}>{slot.ampm}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{slot.service}</div>
                    <div style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 2 }}>{slot.caregiver} · {slot.duration}</div>
                  </div>
                  {booked ? (
                    <span style={{ fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 100, background: 'var(--sage-light)', color: 'var(--sage-dark)' }}>✓ Booked</span>
                  ) : (
                    <button onClick={() => bookSlot(slot.time, slot.service, slot.caregiver)} disabled={loading}
                      style={{ fontSize: 12, fontWeight: 500, padding: '8px 16px', borderRadius: 100, background: 'var(--sage-dark)', color: 'white', border: 'none', cursor: 'pointer' }}>
                      Book
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
