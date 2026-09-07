import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

const navLinks = {
  STUDENT: [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/jobs', label: 'Browse Jobs' },
    { to: '/student/applications', label: 'My Applications' },
    { to: '/student/profile', label: 'Profile' },
  ],
  COMPANY: [
    { to: '/company/dashboard', label: 'Dashboard' },
    { to: '/company/post-job', label: 'Post a Job' },
  ],
  COLLEGE: [
    { to: '/college/dashboard', label: 'Dashboard' },
    { to: '/college/students', label: 'Students' },
    { to: '/admin/analytics', label: 'Analytics' },
  ],
  ADMIN: [
    { to: '/admin/analytics', label: 'Ministry Analytics' },
    { to: '/college/dashboard', label: 'Colleges' },
  ],
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const links = user ? navLinks[user.role] || [] : []

  return (
    <nav className="bg-ayush-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-xl group-hover:bg-white/30 transition-colors">
              🌿
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-base leading-tight">Ayush Portal</div>
              <div className="text-[10px] text-white/70 leading-tight">Ministry of Ayush</div>
            </div>
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === l.to
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium leading-tight">{user.name}</div>
                    <div className="text-[10px] text-white/60 leading-tight">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden md:block px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-ayush-accent text-white hover:bg-yellow-500 transition-colors">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 pt-3 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => { setMenuOpen(false); handleLogout() }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-white/10 transition-colors"
              >
                Logout
              </button>
            )}
            {!user && (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 transition-colors">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-ayush-accent hover:bg-white/10 transition-colors">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
