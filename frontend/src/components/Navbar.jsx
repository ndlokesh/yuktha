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
  Award,
  BookOpen,
  FolderGit2,
  Handshake,
  ChevronDown,
  Compass,
} from 'lucide-react'

const navIcons = {
  Dashboard: LayoutDashboard,
  'Skill Assessment': Sparkles,
  'Digital Portfolio': FolderGit2,
  'Jobs & Internships': Briefcase,
  'Learning Programs': BookOpen,
  'My Applications': FileCheck,
  Profile: User,
  'Industry Opportunities': Handshake,
  'My Proposals': FileCheck,
  'Post Job': PlusCircle,
  'Post Program': BookOpen,
  'Post Collaboration': Handshake,
  Students: Users,
  Analytics: BarChart3,
  'National Analytics': BarChart3,
  Colleges: Users,
}

const navLinks = {
  STUDENT: [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/assessment', label: 'Skill Assessment' },
    { to: '/student/portfolio', label: 'Digital Portfolio' },
    { to: '/student/jobs', label: 'Jobs & Internships' },
    { to: '/student/learning', label: 'Learning Programs' },
    { to: '/student/applications', label: 'My Applications' },
  ],
  FACULTY: [
    { to: '/faculty/dashboard', label: 'Dashboard' },
    { to: '/faculty/opportunities', label: 'Industry Opportunities' },
    { to: '/faculty/proposals', label: 'My Proposals' },
    { to: '/student/learning', label: 'Learning Programs' },
    { to: '/faculty/profile', label: 'Profile' },
  ],
  COMPANY: [
    { to: '/company/dashboard', label: 'Dashboard' },
    { to: '/company/post-job', label: 'Post Job' },
    { to: '/company/post-program', label: 'Post Program' },
    { to: '/company/post-collaboration', label: 'Post Collaboration' },
  ],
  COLLEGE: [
    { to: '/college/dashboard', label: 'Dashboard' },
    { to: '/college/students', label: 'Students' },
    { to: '/admin/analytics', label: 'Analytics' },
  ],
  ADMIN: [
    { to: '/admin/analytics', label: 'National Analytics' },
    { to: '/college/dashboard', label: 'Colleges' },
  ],
}

const roleBadges = {
  STUDENT: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  FACULTY: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  COMPANY: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  COLLEGE: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  ADMIN: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

const roleActiveClasses = {
  STUDENT: 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60',
  FACULTY: 'bg-cyan-600 text-white shadow-md shadow-cyan-950/60',
  COMPANY: 'bg-blue-600 text-white shadow-md shadow-blue-950/60',
  COLLEGE: 'bg-purple-600 text-white shadow-md shadow-purple-950/60',
  ADMIN: 'bg-amber-600 text-white shadow-md shadow-amber-950/60',
}

const demoPersonas = [
  { role: 'STUDENT', email: 'student@ayushportal.demo', name: 'Priya Sharma', title: '🎓 Student (Priya Sharma)', badge: 'Student', accent: 'text-emerald-400', hover: 'hover:bg-emerald-500/20' },
  { role: 'FACULTY', email: 'faculty@ayushportal.demo', name: 'Dr. Rajeshwari', title: '🔬 Academician (Dr. Rajeshwari)', badge: 'Faculty', accent: 'text-cyan-400', hover: 'hover:bg-cyan-500/20' },
  { role: 'COMPANY', email: 'company@ayushportal.demo', name: 'Himalaya R&D', title: '🏢 Industry (Himalaya R&D)', badge: 'Company', accent: 'text-blue-400', hover: 'hover:bg-blue-500/20' },
  { role: 'COLLEGE', email: 'college@ayushportal.demo', name: 'Gujarat Ayurved', title: '🏛️ Institution (Gujarat Ayurved)', badge: 'College', accent: 'text-purple-400', hover: 'hover:bg-purple-500/20' },
  { role: 'ADMIN', email: 'admin@ayushportal.demo', name: 'National Admin', title: '🇮🇳 National Ministry Admin', badge: 'Admin', accent: 'text-amber-400', hover: 'hover:bg-amber-500/20' },
]

export default function Navbar() {
  const { user, logout, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleQuickDemo = async (email) => {
    try {
      await login(email, 'Demo@1234')
      setDemoOpen(false)
      if (email.includes('student')) navigate('/student/dashboard')
      else if (email.includes('faculty')) navigate('/faculty/dashboard')
      else if (email.includes('company')) navigate('/company/dashboard')
      else if (email.includes('college')) navigate('/college/dashboard')
      else if (email.includes('admin')) navigate('/admin/analytics')
    } catch (err) {
      console.error('Demo login error:', err)
    }
  }

  const links = user ? navLinks[user.role] || [] : []

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Tricolor accent border */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" />

      <nav className="bg-slate-950/95 backdrop-blur-xl text-white border-b border-white/10 shadow-lg shadow-black/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand / Emblem */}
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-700 to-slate-900 p-[1px] shadow-md shadow-emerald-900/40 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center overflow-hidden">
                  <span className="font-display font-black text-xl bg-gradient-to-tr from-amber-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                    Y
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
                    Yuktha
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Academia–Industry
                  </span>
                </div>
                <div className="text-[10px] tracking-wide text-slate-400 font-medium leading-none mt-0.5">
                  Unified Collaboration & Skill Intelligence
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {links.map((l) => {
                  const Icon = navIcons[l.label] || Sparkles
                  const isActive = location.pathname === l.to
                  const activeClass = roleActiveClasses[user.role] || 'bg-emerald-600 text-white shadow-sm'
                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                        isActive
                          ? activeClass
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

            {/* Right Action / Switcher & Profile */}
            <div className="flex items-center gap-2.5">
              {/* Quick Persona Switcher Modal / Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDemoOpen(!demoOpen)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
                  title="Switch Demo Role"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Demo Switcher</span>
                  <ChevronDown className="w-3 h-3 text-amber-400" />
                </button>

                {demoOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-white/10">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Instant Persona Switcher
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold">1-Click Live</span>
                    </div>

                    <div className="space-y-1">
                      {demoPersonas.map((p) => {
                        const isCurrent = user?.email === p.email
                        return (
                          <button
                            key={p.email}
                            onClick={() => handleQuickDemo(p.email)}
                            className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isCurrent
                                ? 'bg-white/10 text-white border border-white/20'
                                : `text-slate-300 ${p.hover} hover:text-white`
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{p.title}</span>
                              {isCurrent && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              )}
                            </div>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${p.accent} bg-white/5`}>
                              {isCurrent ? 'ACTIVE' : p.badge}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-white leading-tight">{user.name}</div>
                      <span className={`inline-block mt-0.5 px-2 py-0.2 rounded-full text-[9px] font-bold border uppercase ${roleBadges[user.role] || 'text-slate-300'}`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-[1px] shadow-sm">
                      <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center font-bold text-xs text-emerald-300">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-white/10 transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Toggle Navigation"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-slate-950 px-4 py-4 space-y-2">
            {links.map((l) => {
              const Icon = navIcons[l.label] || Sparkles
              const isActive = location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
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
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            ) : (
              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20"
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
