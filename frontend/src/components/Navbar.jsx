import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  FileCheck,
  User,
  PlusCircle,
  Users,
  BarChart3,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

const navIcons = {
  Dashboard: LayoutDashboard,
  'Browse Jobs': Briefcase,
  'My Applications': FileCheck,
  Profile: User,
  'Post a Job': PlusCircle,
  Students: Users,
  Analytics: BarChart3,
  'Ministry Analytics': BarChart3,
  Colleges: Users,
}

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

const roleBadges = {
  STUDENT: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  COMPANY: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  COLLEGE: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  ADMIN: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
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
    <header className="sticky top-0 z-50 w-full">
      {/* Tricolor accent border */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" />

      <nav className="bg-slate-950/90 backdrop-blur-xl text-white border-b border-white/10 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand / Emblem */}
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3.5 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-teal-950 p-[1px] shadow-md shadow-emerald-900/40 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-400" fill="currentColor">
                    {/* Stylized Lotus Emblem */}
                    <path d="M12 3C12 3 10.5 7 8 9C5.5 11 3 11 3 11C3 11 6 13 8 16C10 19 12 21 12 21C12 21 14 19 16 16C18 13 21 11 21 11C21 11 18.5 11 16 9C13.5 7 12 3 12 3Z" opacity="0.9" />
                    <circle cx="12" cy="13" r="2.5" className="text-emerald-400" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
                    Ayush Portal
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    SIH26044
                  </span>
                </div>
                <div className="text-[10px] tracking-wide text-slate-400 font-medium leading-none mt-0.5">
                  Ministry of Ayush · Govt. of India
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <div className="hidden md:flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                {links.map((l) => {
                  const Icon = navIcons[l.label] || Sparkles
                  const isActive = location.pathname === l.to
                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{l.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Right Action / Profile */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-white/10">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-white leading-tight">{user.name}</div>
                      <span className={`inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold border uppercase ${roleBadges[user.role] || 'text-slate-300'}`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-[1px] shadow-sm">
                      <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center font-bold text-xs text-emerald-300">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-white/10 transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 transition-all active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register Free</span>
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Toggle Navigation"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-950 px-4 py-4 space-y-2">
            {links.map((l) => {
              const Icon = navIcons[l.label] || Sparkles
              const isActive = location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{l.label}</span>
                </Link>
              )
            })}

            {!user ? (
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-slate-950"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Free</span>
                </Link>
              </div>
            ) : (
              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
