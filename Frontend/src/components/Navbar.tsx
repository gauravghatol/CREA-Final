import { NavLink, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import logo from '../assets/crea-logo.svg'
import { useAuth } from '../context/auth'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function onDoc(e: MouseEvent){
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="h-1 bg-gradient-to-r from-blue-900 via-amber-400 to-blue-900" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="CREA" className="h-8 w-8" />
            <span className="text-blue-900 font-semibold">CREA Portal</span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>Dashboard</NavLink>
            <NavLink to="/events" className={navLinkClass}>Events</NavLink>
            <NavLink to="/forum" className={navLinkClass}>Forum</NavLink>
            <NavLink to="/documents" className={navLinkClass}>Documents</NavLink>
            <NavLink to="/apply-membership" className={navLinkClass}>Membership</NavLink>
            <NavLink to="/body-details" className={navLinkClass}>Association Body</NavLink>
            <NavLink to="/suggestions" className={navLinkClass}>Suggestions</NavLink>
            <NavLink to="/mutual-transfers" className={navLinkClass}>Mutual Transfers</NavLink>
            <NavLink to="/external-links" className={navLinkClass}>External Links</NavLink>
            {!user ? (
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            ) : (
              <div className="relative" ref={menuRef}>
                <button onClick={()=>setMenuOpen(o=>!o)} className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-gray-50">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-white font-semibold">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                  <span className="text-sm text-blue-900 font-medium">{user.name}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-md py-1 z-50">
                    {user.role==='admin' && <Link to="/admin" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={()=>setMenuOpen(false)}>Admin</Link>}
                    <Link to="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={()=>setMenuOpen(false)}>Profile</Link>
                    <Link to="/files" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={()=>setMenuOpen(false)}>Files</Link>
                    <hr className="my-1" />
                    <button onClick={logout} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="md:hidden rounded-md p-2 hover:bg-gray-100" onClick={()=>setOpen(o=>!o)} aria-label="Toggle navigation">
            ☰
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            <NavLink to="/" className={navLinkClass} end onClick={()=>setOpen(false)}>Dashboard</NavLink>
            <NavLink to="/events" className={navLinkClass} onClick={()=>setOpen(false)}>Events</NavLink>
            <NavLink to="/forum" className={navLinkClass} onClick={()=>setOpen(false)}>Forum</NavLink>
            <NavLink to="/documents" className={navLinkClass} onClick={()=>setOpen(false)}>Documents</NavLink>
            <NavLink to="/apply-membership" className={navLinkClass} onClick={()=>setOpen(false)}>Membership</NavLink>
            <NavLink to="/body-details" className={navLinkClass} onClick={()=>setOpen(false)}>Association Body</NavLink>
            <NavLink to="/suggestions" className={navLinkClass} onClick={()=>setOpen(false)}>Suggestions</NavLink>
            <NavLink to="/mutual-transfers" className={navLinkClass} onClick={()=>setOpen(false)}>Mutual Transfers</NavLink>
            <NavLink to="/external-links" className={navLinkClass} onClick={()=>setOpen(false)}>External Links</NavLink>
            {!user ? (
              <NavLink to="/login" className={navLinkClass} onClick={()=>setOpen(false)}>Login</NavLink>
            ) : (
              <>
                {user.role==='admin' && <NavLink to="/admin" className={navLinkClass} onClick={()=>setOpen(false)}>Admin</NavLink>}
                <NavLink to="/profile" className={navLinkClass} onClick={()=>setOpen(false)}>Profile</NavLink>
                <NavLink to="/files" className={navLinkClass} onClick={()=>setOpen(false)}>Files</NavLink>
                <button onClick={()=>{ logout(); setOpen(false) }} className="px-3 py-2 rounded-md text-left text-sm font-medium text-blue-900 hover:bg-blue-50">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
