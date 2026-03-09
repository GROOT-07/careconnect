import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { MoodCheckin } from '@/components/patient/MoodCheckin'

export default async function PatientPage() {
  const user = await getCurrentUser()
  const client = await db.client.findFirst({
    where: { patientUserId: user!.id },
    include: {
      memories: { orderBy: { createdAt: 'desc' }, take: 1 },
      medications: { where: { isActive: true } },
      bookings: { where: { scheduledAt: { gte: new Date() } }, orderBy: { scheduledAt: 'asc' }, take: 3 },
    }
  })

  const todayMemory = client?.memories[0]
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">
          Good morning, <em className="text-[#7B6BC4]">{user?.name?.split(' ')[0]}</em> 🌸
        </h1>
        <p className="text-warm-gray font-light">{today}. A beautiful day.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {todayMemory && (
          <div className="card border-2 border-[#9B8EC4]/20">
            <h3 className="font-fraunces text-xl font-medium mb-4">Today's Memory 💜</h3>
            <div className="rounded-2xl p-5 mb-4" style={{ background: 'linear-gradient(135deg,rgba(155,142,196,0.1),rgba(107,181,160,0.1))' }}>
              <p className="text-xs text-warm-gray mb-2 font-medium font-fraunces italic">{todayMemory.year} · {todayMemory.category}</p>
              <h4 className="font-fraunces text-xl font-medium mb-3 text-[#2C2825]">{todayMemory.title}</h4>
              <p className="text-sm text-warm-gray leading-relaxed">{todayMemory.description.slice(0,200)}…</p>
            </div>
            <a href="/patient/memories" className="w-full block">
              <button className="w-full py-3 rounded-xl font-medium text-sm text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: '#7B6BC4', boxShadow: '0 6px 18px rgba(123,107,196,0.3)' }}>
                Explore This Memory 💬
              </button>
            </a>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="card">
            <h3 className="font-fraunces text-xl font-medium mb-4">Today's Schedule</h3>
            <div className="flex flex-col gap-2">
              {[
                { done: true, text: 'Morning stretch & breakfast', time: '8:00' },
                { done: false, text: 'Take medication with Maria', time: '10:00' },
                { done: false, text: 'Photo album activity', time: '11:00' },
                { done: false, text: 'Video call with Sarah', time: '15:00' },
              ].map((t, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${t.done ? 'bg-cream' : 'bg-white border border-light-gray'}`}>
                  <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 ${t.done ? 'bg-[#7B6BC4] border-[#7B6BC4]' : 'border-light-gray'}`}>
                    {t.done && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className={`flex-1 text-sm ${t.done ? 'line-through text-warm-gray' : ''}`}>{t.text}</span>
                  <span className="text-xs text-warm-gray">{t.time}</span>
                </div>
              ))}
            </div>
          </div>
          <MoodCheckin clientId={client?.id || ''} />
        </div>
      </div>
    </div>
  )
}
