import { useMemo, useState } from 'react'

export type Column<T> = {
  key: keyof T
  header: string
  render?: (row: T) => React.ReactNode
}

export default function DataTable<T extends Record<string, unknown>>({ data, columns, initialQuery = '' }: { data: T[]; columns: Column<T>[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    if (!query.trim()) return data
    const q = query.toLowerCase()
    return data.filter((row) => Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q)))
  }, [data, query])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const arr = [...filtered]
    arr.sort((a,b) => {
      const av = String(a[sortKey] ?? '')
      const bv = String(b[sortKey] ?? '')
      return sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return arr
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page])

  const onSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(d => d==='asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <input
          placeholder="Search..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
        />
        <div className="hidden sm:block text-xs text-gray-500 whitespace-nowrap">{filtered.length} result(s)</div>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((c) => {
                const key = c.key
                const active = sortKey===key
                return (
                  <th key={String(key)} className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <button className="inline-flex items-center gap-1 hover:underline" onClick={()=>onSort(key)}>
                      {c.header}
                      {active && <span>{sortDir==='asc'?'▲':'▼'}</span>}
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {current.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap">
                    {c.render ? c.render(row) : String(row[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
            {current.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages>1 && (
        <div className="flex items-center justify-end gap-2 text-sm">
          <button className="rounded border px-2 py-1 hover:bg-gray-50 disabled:opacity-50" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
          <span className="text-gray-600">Page {page} of {totalPages}</span>
          <button className="rounded border px-2 py-1 hover:bg-gray-50 disabled:opacity-50" disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
        </div>
      )}
    </div>
  )
}
