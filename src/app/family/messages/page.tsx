export default function MessagesPage() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <h1 className="font-fraunces text-4xl font-medium tracking-tight mb-1">Messages</h1>
      <p className="text-warm-gray font-light mb-8">Conversations with Eleanor's care team.</p>
      <div className="grid grid-cols-2 gap-6 h-[calc(100vh-220px)]">
        <div className="card p-0 overflow-hidden">
          <div className="p-5 border-b border-light-gray"><h3 className="font-fraunces text-lg font-medium">Conversations</h3></div>
          {[{ name: 'Maria Chen', preview: 'About lunch preferences…', time: '9:42 AM', color: 'bg-sage-dark' },
            { name: 'James Osei', preview: 'Eleanor enjoyed the puzzle…', time: 'Yesterday', color: 'bg-sky' }].map((c, i) => (
            <div key={i} className="p-4 flex gap-3 items-center hover:bg-cream cursor-pointer border-b border-light-gray/50 transition-colors">
              <div className={`w-10 h-10 rounded-full ${c.color} flex items-center justify-center text-white font-fraunces text-sm font-semibold flex-shrink-0`}>{c.name[0]}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-warm-gray truncate">{c.preview}</p></div>
              <p className="text-xs text-warm-gray flex-shrink-0">{c.time}</p>
            </div>
          ))}
        </div>
        <div className="card flex flex-col gap-3">
          <h3 className="font-fraunces text-lg font-medium border-b border-light-gray pb-4 -mt-2">Maria Chen</h3>
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            <div className="bg-cream px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[80%]">Hi Sarah! Eleanor had a lovely morning. She asked for soup for lunch — is that OK?</div>
            <div className="bg-sage-dark text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm max-w-[80%] self-end">That sounds perfect, thank you Maria! 🌿</div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-light-gray">
            <input className="input flex-1 text-sm" placeholder="Type a message…" />
            <button className="w-10 h-10 rounded-full bg-sage-dark text-white flex items-center justify-center text-lg hover:bg-sage transition-colors">→</button>
          </div>
        </div>
      </div>
    </div>
  )
}
