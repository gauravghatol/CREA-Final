type Day = { date: Date; isCurrentMonth: boolean }

export default function Calendar({ year, month, markers = [] }: { year: number; month: number; markers?: string[] }) {
  const first = new Date(year, month, 1)
  const start = new Date(first)
  start.setDate(1 - ((first.getDay() + 6) % 7)) // start on Monday
  const days: Day[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push({ date: d, isCurrentMonth: d.getMonth() === month })
  }
  const markerSet = new Set(markers.map((s) => s.split('T')[0]))
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  return (
    <div className="grid grid-cols-7 gap-px rounded-md border bg-gray-200 text-sm overflow-hidden">
      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((w) => (
        <div key={w} className="bg-gray-50 px-2 py-1 text-center font-semibold text-gray-700">{w}</div>
      ))}
      {days.map((d, idx) => {
        const key = fmt(d.date)
        const marked = markerSet.has(key)
        return (
          <div key={idx} className={`min-h-16 bg-white p-2 ${d.isCurrentMonth? '' : 'bg-gray-50 text-gray-400'}`}>
            <div className="flex items-center justify-between">
              <span>{d.date.getDate()}</span>
              {marked && <span className="h-2 w-2 rounded-full bg-amber-500" />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
