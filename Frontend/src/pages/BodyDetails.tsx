import { useEffect, useState } from 'react'
import { getBodyMembers } from '../services/api'
import type { BodyMember } from '../types'
import SectionHeader from '../components/SectionHeader'
import { usePageTitle } from '../hooks/usePageTitle'

export default function BodyDetails() {
  const [list, setList] = useState<BodyMember[]>([])
  usePageTitle('CREA • Association Body')
  useEffect(() => { getBodyMembers().then(setList) }, [])

  return (
    <div className="space-y-6">
      <SectionHeader title="Association Body" subtitle="Meet the office bearers of CREA." />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {list.map(m => (
          <div key={m.id} className="rounded-lg border bg-white p-4 text-center shadow-sm">
            <img src={m.photoUrl} alt={m.name} className="mx-auto h-24 w-24 rounded-full object-cover"/>
            <div className="mt-3 font-semibold text-gray-800">{m.name}</div>
            <div className="text-sm text-gray-600">{m.designation}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
