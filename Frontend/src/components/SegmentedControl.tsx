export default function SegmentedControl<T extends string>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-md border bg-white p-1 shadow-sm">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} className={`px-3 py-1 text-sm rounded ${o.value===value ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
