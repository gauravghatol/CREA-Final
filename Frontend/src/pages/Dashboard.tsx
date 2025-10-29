import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Calendar from '../components/Calendar'
import SectionHeader from '../components/SectionHeader'
import { usePageTitle } from '../hooks/usePageTitle'
import { getCirculars, getCourtCases, getEvents, getForumTopics, getMemberCounts, getTotals } from '../services/api'
import type { Circular, CourtCase, EventItem, ForumTopic, MemberCount } from '../types'

export default function Dashboard() {
  const [counts, setCounts] = useState<MemberCount[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [cases, setCases] = useState<CourtCase[]>([])
  const navigate = useNavigate()
  usePageTitle('CREA • Dashboard')
  const [totals, setTotals] = useState<{ divisions: number; members: number; courtCases: number }>({ divisions: 0, members: 0, courtCases: 0 })
  useEffect(() => {
    const load = async () => {
      const [counts, totals, events, topics, circulars, cases] = await Promise.all([
        getMemberCounts(),
        getTotals(),
        getEvents(),
        getForumTopics(),
        getCirculars(),
        getCourtCases(),
      ])
      setCounts(counts)
      setTotals(totals)
      setEvents(events)
      setTopics(topics)
      setCirculars(circulars)
      setCases(cases)
    }
    load()
    const onStats = () => load()
    window.addEventListener('crea:stats-changed', onStats as EventListener)
    return () => window.removeEventListener('crea:stats-changed', onStats as EventListener)
  }, [])

  const breaking = useMemo(() => events.find(e => e.breaking), [events])

  return (
    <div className="space-y-10">
      {/* Hero banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Central Railway Engineers Association</h1>
            <p className="text-sm text-blue-100 mt-1">Official portal for events, circulars, discussions, and membership.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/10 rounded-md p-3">
              <div className="text-xs">Divisions</div>
              <div className="text-lg font-semibold">{totals.divisions}</div>
            </div>
            <div className="bg-white/10 rounded-md p-3">
              <div className="text-xs">Members</div>
              <div className="text-lg font-semibold">{totals.members.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 rounded-md p-3">
              <div className="text-xs">Active Cases</div>
              <div className="text-lg font-semibold">{totals.courtCases}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Breaking news */}
      {breaking && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-800">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-amber-600">⚡</div>
            <div className="flex-1">
              <div className="font-semibold">Breaking News</div>
              <div className="text-sm">{breaking.title} on {new Date(breaking.date).toLocaleDateString()} at {breaking.location}</div>
              <div className="mt-2">
                <Button onClick={() => navigate('/events')}>View Events</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Division stats */}
      <SectionHeader title="Division-wise Member Count" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {counts.map((c) => (
          <Card key={c.division}>
            <div className="text-sm text-gray-500">{c.division}</div>
            <div className="mt-1 text-2xl font-bold text-blue-900">{c.count}</div>
          </Card>
        ))}
      </div>

      {/* Quick previews */}
      <SectionHeader title="Quick Previews" subtitle="A snapshot of what's new across the portal" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card title={
          <div className="flex items-center justify-between">
            <span>Events</span>
            <button className="text-xs text-blue-900 hover:underline" onClick={() => navigate('/events')}>View all</button>
          </div>
        }>
          <ul className="space-y-2">
            {events.slice(0,2).map(e => (
              <li key={e.id}>
                <button onClick={() => navigate('/events')} className="w-full text-left rounded-md px-2 py-1.5 hover:bg-gray-50">
                  <div className="text-sm font-medium text-gray-800 truncate">{e.title}</div>
                  <div className="text-xs text-gray-600">{new Date(e.date).toLocaleDateString()} • {e.location}</div>
                </button>
              </li>
            ))}
            {events.length === 0 && <li className="text-sm text-gray-500">No events yet.</li>}
          </ul>
        </Card>

        <Card title={
          <div className="flex items-center justify-between">
            <span>Forum</span>
            <button className="text-xs text-blue-900 hover:underline" onClick={() => navigate('/forum')}>View all</button>
          </div>
        }>
          <ul className="space-y-2">
            {topics.slice(0,2).map(t => (
              <li key={t.id}>
                <button onClick={() => navigate('/forum')} className="w-full text-left rounded-md px-2 py-1.5 hover:bg-gray-50">
                  <div className="text-sm font-medium text-gray-800 truncate">{t.title}</div>
                  <div className="text-xs text-gray-600">{t.replies} replies • {new Date(t.createdAt).toLocaleDateString()}</div>
                </button>
              </li>
            ))}
            {topics.length === 0 && <li className="text-sm text-gray-500">No topics yet.</li>}
          </ul>
        </Card>

        <Card title={
          <div className="flex items-center justify-between">
            <span>Circulars</span>
            <button className="text-xs text-blue-900 hover:underline" onClick={() => navigate('/circulars')}>View all</button>
          </div>
        }>
          <ul className="space-y-2">
            {circulars.slice(0,2).map(c => (
              <li key={c.id}>
                <button onClick={() => navigate('/circulars')} className="w-full text-left rounded-md px-2 py-1.5 hover:bg-gray-50">
                  <div className="text-sm font-medium text-gray-800 truncate">{c.subject}</div>
                  <div className="text-xs text-gray-600">{c.boardNumber} • {new Date(c.dateOfIssue).toLocaleDateString()}</div>
                </button>
              </li>
            ))}
            {circulars.length === 0 && <li className="text-sm text-gray-500">No circulars yet.</li>}
          </ul>
        </Card>

        <Card title={
          <div className="flex items-center justify-between">
            <span>Court Cases</span>
            <button className="text-xs text-blue-900 hover:underline" onClick={() => navigate('/court-cases')}>View all</button>
          </div>
        }>
          <ul className="space-y-2">
            {cases.slice(0,2).map(cc => (
              <li key={cc.id}>
                <button onClick={() => navigate('/court-cases')} className="w-full text-left rounded-md px-2 py-1.5 hover:bg-gray-50">
                  <div className="text-sm font-medium text-gray-800 truncate">{cc.caseNumber}</div>
                  <div className="text-xs text-gray-600">{new Date(cc.date).toLocaleDateString()} • {cc.subject}</div>
                </button>
              </li>
            ))}
            {cases.length === 0 && <li className="text-sm text-gray-500">No court cases.</li>}
          </ul>
        </Card>
      </div>

      {/* Calendar & quick actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card title={
          <div className="flex items-center justify-between">
            <span>Event Calendar</span>
            <button className="text-xs text-blue-900 hover:underline" onClick={() => navigate('/events')}>Open</button>
          </div>
        } className="xl:col-span-2">
          <Calendar year={new Date().getFullYear()} month={new Date().getMonth()} markers={events.map(e=>e.date)} />
        </Card>

        <Card title="Quick Links">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate('/apply-membership')}>Apply Membership</Button>
            <Button variant="secondary" onClick={() => navigate('/manuals')}>Manuals</Button>
            <Button variant="ghost" onClick={() => navigate('/body-details')}>Association Body</Button>
            <Button variant="ghost" onClick={() => navigate('/suggestions')}>Suggestions</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
