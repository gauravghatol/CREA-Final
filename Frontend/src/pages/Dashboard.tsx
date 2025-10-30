import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { STAGGER } from '../animations'
import Card from '../components/Card'
import Calendar from '../components/Calendar'
import SectionHeader from '../components/SectionHeader'
import CounterCard from '../components/CounterCard'
import BreakingNews from '../components/BreakingNews'
import QuickPreviewCard from '../components/QuickPreviewCard'
import QuickLinks from '../components/QuickLinks'
import { EventIcon, ForumIcon, CircularIcon, CourtCaseIcon, CalendarIcon, UserIcon } from '../components/Icons'
import { StaggerContainer, StaggerItem } from '../components/StaggerAnimation'
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
    <div className="space-y-8 xl:space-y-10">
      {/* Header block */}
      <motion.div
        className="rounded-xl bg-white border p-6 shadow-sm"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 items-start justify-between gap-20 ">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Welcome to Central Railway Engineers Association's Portal</h1>
              <p className="text-sm text-gray-600 mt-1 text-justify">The Central Railway Engineers Association stands as a beacon of professional excellence, uniting engineering minds across the vast network of Central Railway. Established decades ago, our association has been the cornerstone for engineers who design, maintain, and innovate the critical infrastructure that keeps millions moving daily. From the bustling platforms of Mumbai to the historic stations of Nagpur, our members contribute their expertise to ensure safety, efficiency, and modernization of railway operations. Through collaborative forums, knowledge sharing sessions, and continuous professional development, we foster a community dedicated to engineering excellence. Our association provides a platform for technical discussions, addresses professional concerns, facilitates mutual transfers, and champions the rights and welfare of railway engineers. With divisions spanning across BSL, Pune, Solapur, Nagpur, and Mumbai, we bring together diverse expertise and experiences.</p>
            </div>
            {/* Key stats */}

            <div className='hidden md:grid grid-row-2 gap-3'>
              <div className="hidden md:grid grid-cols-3 gap-3">
                <CounterCard label="Divisions" value={totals.divisions} delay={0} icon={<UserIcon />} />
                <CounterCard label="Members" value={totals.members} delay={1} icon={<UserIcon />} />
                <CounterCard label="Active Cases" value={totals.courtCases} delay={2} icon={<CourtCaseIcon />} />
              </div>
              {breaking && (
                <BreakingNews
                  title={breaking.title}
                  content={`Scheduled event at ${breaking.location}`}
                  date={breaking.date}
                  location={breaking.location}
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left column: Quick previews and links */}
        <div className="space-y-4 xl:col-span-2">
          <SectionHeader title="Division-wise Member Count" />
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {counts.map((c, index) => (
              <StaggerItem key={c.division}>
                <Card delay={index * STAGGER.children}>
                  <div className="text-sm text-gray-500">{c.division}</div>
                  <div className="mt-1 text-2xl font-bold text-blue-900">{c.count}</div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <SectionHeader title="What's new" subtitle="Recent updates from across the portal" />
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
            <QuickPreviewCard title="Events" icon={<EventIcon />} items={events.map(e => ({ id: e.id, title: e.title, subtitle: e.location, date: e.date }))} onViewAll={()=>navigate('/events')} delay={0} />
            <QuickPreviewCard title="Forum" icon={<ForumIcon />} items={topics.map(t => ({ id: t.id, title: t.title, subtitle: `${t.replies} replies`, date: t.createdAt }))} onViewAll={()=>navigate('/forum')} delay={1} />
            <QuickPreviewCard title="Circulars" icon={<CircularIcon />} items={circulars.map(c => ({ id: c.id, title: c.subject, subtitle: c.boardNumber, date: c.dateOfIssue }))} onViewAll={()=>navigate('/circulars')} delay={2} />
            <QuickPreviewCard title="Court Cases" icon={<CourtCaseIcon />} items={cases.map(cc => ({ id: cc.id, title: cc.caseNumber, subtitle: cc.subject, date: cc.date }))} onViewAll={()=>navigate('/court-cases')} delay={3} />
          </div>
        </div>

        {/* Right column: Calendar and quick actions */}
        <div className="space-y-4">
      <Card title={
            <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2"><CalendarIcon /> Event Calendar</span>
        <button className="text-xs text-brand hover:text-brand-900 no-underline" onClick={() => navigate('/events')}>Open</button>
            </div>
          }>
            <Calendar year={new Date().getFullYear()} month={new Date().getMonth()} markers={events.map(e=>e.date)} />
          </Card>

          <QuickLinks onApplyMembership={()=>navigate('/apply-membership')} onViewManuals={()=>navigate('/manuals')} />
        </div>
      </div>
    </div>
  )
}