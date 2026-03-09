export default function ActivitiesPage() {
  const activities = [
    { emoji: '🧩', title: 'Daily Puzzle', desc: 'A gentle word puzzle selected just for you today.', color: '#7B6BC4' },
    { emoji: '🎵', title: 'Memory Music', desc: 'Songs from your favourite eras and cherished memories.', color: '#5E8561' },
    { emoji: '📖', title: 'Story Time', desc: 'Record a new memory or listen to an old one read aloud.', color: '#C4724A' },
    { emoji: '🎨', title: 'Colouring', desc: 'Relax with beautiful patterns to colour at your own pace.', color: '#7B9EC7' },
    { emoji: '🌿', title: 'Nature Sounds', desc: 'Calming nature soundscapes — rain, birds, forest walks.', color: '#6BB5A0' },
    { emoji: '📸', title: 'Photo Sharing', desc: 'Browse and share family photos with your loved ones.', color: '#9B8EC4' },
  ]
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">Activities 🎨</h1>
      <p className="text-warm-gray font-light mb-8">Gentle daily activities to keep your mind active and joyful.</p>
      <div className="grid grid-cols-3 gap-5">
        {activities.map((a, i) => (
          <div key={i} className="card cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group text-center">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{a.emoji}</div>
            <h3 className="font-fraunces text-xl font-medium mb-2">{a.title}</h3>
            <p className="text-sm text-warm-gray leading-relaxed mb-4">{a.desc}</p>
            <button className="text-sm font-medium px-5 py-2 rounded-full text-white transition-all hover:opacity-90" style={{ background: a.color }}>
              Start Activity
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
