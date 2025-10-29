import { useEffect, useMemo, useState } from 'react'
import { getForumPosts, getForumTopics, loadDemoData } from '../services/api'
import type { ForumPost, ForumTopic } from '../types'
import Button from '../components/Button'
import SectionHeader from '../components/SectionHeader'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Forum() {
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [active, setActive] = useState<ForumTopic | null>(null)
  const [query, setQuery] = useState('')
  const [reply, setReply] = useState('')
  usePageTitle('CREA • Forum')

  useEffect(() => {
    (async () => {
      await loadDemoData()
      const ts = await getForumTopics()
      setTopics(ts)
    })()
  }, [])
  useEffect(() => { if (active) getForumPosts(active.id).then(setPosts) }, [active])

  const filtered = useMemo(() => {
    if (!query) return topics
    const q = query.toLowerCase()
    return topics.filter(t => t.title.toLowerCase().includes(q))
  }, [topics, query])

  return (
    <div className="space-y-4">
      <SectionHeader title="Discussion Forum" subtitle="Search topics, read threads, and share insights." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1 space-y-3">
        <h2 className="text-xl font-semibold text-blue-900">Discussion Topics</h2>
        <input placeholder="Search topics" value={query} onChange={(e)=>setQuery(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900"/>
        <div className="rounded-md border bg-white divide-y">
          {filtered.map(t => (
            <button key={t.id} className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${active?.id===t.id?'bg-blue-50':''}`} onClick={()=>setActive(t)}>
              <div className="font-medium text-gray-800">{t.title}</div>
              <div className="text-xs text-gray-500">By {t.author} • {new Date(t.createdAt).toLocaleDateString()} • {t.replies} replies</div>
            </button>
          ))}
          {filtered.length===0 && <div className="p-4 text-sm text-gray-500">No topics found.</div>}
        </div>
      </div>
      <div className="lg:col-span-2">
        {!active ? (
          <div className="rounded-md border bg-white p-6 text-gray-600">Select a topic to view discussion.</div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border bg-white p-4">
              <h3 className="text-lg font-semibold text-gray-800">{active.title}</h3>
              <div className="text-xs text-gray-500">Started by {active.author} on {new Date(active.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="space-y-3">
              {posts.map(p => (
                <div key={p.id} className="rounded-md border bg-white p-4">
                  <div className="text-sm text-gray-600">{p.author} • {new Date(p.createdAt).toLocaleString()}</div>
                  <p className="mt-1 text-gray-800 whitespace-pre-wrap">{p.content}</p>
                </div>
              ))}
            </div>
            <div className="rounded-md border bg-white p-4 space-y-2">
              <textarea value={reply} onChange={(e)=>setReply(e.target.value)} rows={4} placeholder="Write a reply..." className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900"/>
              <Button onClick={()=>{ if(reply.trim()){ alert('Reply posted (mock)'); setReply('') } }}>Post Reply</Button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
