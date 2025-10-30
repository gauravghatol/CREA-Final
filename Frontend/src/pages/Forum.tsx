import { useEffect, useMemo, useState } from 'react'
import { getForumPosts, getForumTopics, loadDemoData, createForumPost, toggleLikePost, addCommentToPost, deleteForumPost, deletePostComment } from '../services/api'
import type { ForumPost, ForumTopic } from '../types'
import Button from '../components/Button'
import SectionHeader from '../components/SectionHeader'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAuth } from '../context/auth'

export default function Forum() {
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [active, setActive] = useState<ForumTopic | null>(null)
  const [query, setQuery] = useState('')
  const [reply, setReply] = useState('')
  const [commentInputs, setCommentInputs] = useState<Record<string,string>>({})
  usePageTitle('CREA • Forum')
  const { user } = useAuth()

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
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">{p.author} • {new Date(p.createdAt).toLocaleString()}</div>
                    <div className="flex items-center space-x-3">
                      <button
                        className="text-sm text-gray-600 hover:text-blue-900"
                        onClick={async () => {
                          try {
                            if (!active) return
                            await toggleLikePost(active.id, p.id)
                            const refreshed = await getForumPosts(active.id)
                            setPosts(refreshed)
                          } catch (err) {
                            alert((err as Error).message || 'Could not like post')
                          }
                        }}
                      >
                        👍 {p.likesCount ?? 0}
                      </button>
                      {user && (user.role === 'admin' || p.author === user.name) && (
                        <button
                          className="text-sm text-red-600 hover:text-red-800"
                          onClick={async () => {
                            if (!active) return
                            if (!confirm('Delete this post?')) return
                            try {
                              await deleteForumPost(active.id, p.id)
                              const refreshed = await getForumPosts(active.id)
                              setPosts(refreshed)
                            } catch (err) {
                              alert((err as Error).message || 'Could not delete post')
                            }
                          }}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-gray-800 whitespace-pre-wrap">{p.content}</p>
                  {/* comments */}
                  <div className="mt-3 space-y-2">
                    {(p.comments || []).map((c, i) => (
                      <div key={i} className="text-sm text-gray-700 border-l pl-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">{c.author}</div>
                          {user && (user.role === 'admin' || c.author === user.name) && (
                            <button
                              className="text-xs text-red-600 hover:text-red-800"
                              onClick={async () => {
                                if (!active) return
                                if (!confirm('Delete this comment?')) return
                                try {
                                  await deletePostComment(active.id, p.id, i)
                                  const refreshed = await getForumPosts(active.id)
                                  setPosts(refreshed)
                                } catch (err) {
                                  alert((err as Error).message || 'Could not delete comment')
                                }
                              }}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                        <div className="mt-1 whitespace-pre-wrap">{c.content}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <input value={commentInputs[p.id] || ''} onChange={(e)=>setCommentInputs(s=>({...s,[p.id]:e.target.value}))} placeholder="Write a comment..." className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900" />
                    <div className="mt-2">
                      <Button onClick={async ()=>{
                        if (!active) return
                        const v = (commentInputs[p.id] || '').trim()
                        if (!v) return
                        try {
                          await addCommentToPost(active.id, p.id, v)
                          const refreshed = await getForumPosts(active.id)
                          setPosts(refreshed)
                          setCommentInputs(s=>({...s,[p.id]:''}))
                        } catch (err) {
                          alert((err as Error).message || 'Could not post comment')
                        }
                      }}>Comment</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-md border bg-white p-4 space-y-2">
              <textarea value={reply} onChange={(e)=>setReply(e.target.value)} rows={4} placeholder={user ? "Write a reply..." : "Login to post a reply"} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900" disabled={!user}/>
              <Button onClick={async ()=>{
                if (!user) return alert('Please login to post')
                if (!active) return
                const v = reply.trim()
                if (!v) return
                try {
                  await createForumPost(active.id, v)
                  const refreshed = await getForumPosts(active.id)
                  setPosts(refreshed)
                  setReply('')
                } catch (err) {
                  alert((err as Error).message || 'Could not post reply')
                }
              }} disabled={!user}>Post Reply</Button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
