import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const skills = [
  { name: 'Panchkarma', system: 'Ayurveda' },
  { name: 'Nadi Pariksha', system: 'Ayurveda' },
  { name: 'Shirodhara', system: 'Ayurveda' },
  { name: 'Pranayama Therapy', system: 'Yoga' },
  { name: 'Yoga Nidra', system: 'Yoga' },
  { name: 'Hijama (Wet Cupping)', system: 'Unani' },
  { name: 'Varma Therapy', system: 'Siddha' },
  { name: 'Repertorization', system: 'Homeopathy' },
  { name: 'GCP Compliance', system: 'Research' },
  { name: 'Kshar Sutra', system: 'Ayurveda' },
  { name: 'Mud Therapy', system: 'Naturopathy' },
  { name: 'CTRI Documentation', system: 'Research' },
]

const systemColor = {
  Ayurveda: 'bg-emerald-100 text-emerald-800',
  Yoga: 'bg-teal-100 text-teal-800',
  Unani: 'bg-blue-100 text-blue-800',
  Siddha: 'bg-purple-100 text-purple-800',
  Homeopathy: 'bg-pink-100 text-pink-800',
  Research: 'bg-amber-100 text-amber-800',
  Naturopathy: 'bg-cyan-100 text-cyan-800',
}

const roles = [
  {
    icon: '🎓',
    title: 'For Students',
    color: 'from-emerald-500 to-teal-600',
    points: [
      'Build a verified Ayush skill profile',
      'Discover internships & placements from Ayush companies',
      'Track your applications in real-time',
      'Get shortlisted based on your exact skill match',
    ],
    cta: 'Join as Student',
    href: '/register?role=STUDENT',
  },
  {
    icon: '🏢',
    title: 'For Companies',
    color: 'from-blue-500 to-indigo-600',
    points: [
      'Post internships & jobs with Ayush skill requirements',
      'Search verified Ayush graduates by skill & location',
      'AI-powered skill-match scoring for every applicant',
      'Manage shortlisting and hiring pipeline',
    ],
    cta: 'Register Company',
    href: '/register?role=COMPANY',
  },
  {
    icon: '🏛️',
    title: 'For Colleges',
    color: 'from-violet-500 to-purple-700',
    points: [
      'Track batch-wise placement analytics',
      'Verify & activate student accounts',
      'View top hiring companies and demanded skills',
      'Export placement reports for Ministry compliance',
    ],
    cta: 'Register Institution',
    href: '/register?role=COLLEGE',
  },
]

const stats = [
  { value: '46+', label: 'Ayush Skill Categories' },
  { value: '6', label: 'Systems of Medicine' },
  { value: '3', label: 'User Roles Supported' },
  { value: '∞', label: 'Placement Opportunities' },
]

export default function Landing() {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav className="bg-ayush-primary text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-xl">🌿</div>
            <div>
              <div className="font-display font-bold text-base leading-tight">Ayush Portal</div>
              <div className="text-[10px] text-white/70">Ministry of Ayush, Govt. of India</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-1.5 text-sm font-semibold bg-ayush-accent text-white hover:bg-yellow-500 rounded-lg transition-colors">
              Register Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-ayush-dark via-ayush-primary to-ayush-secondary overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-white/20">
              🇮🇳 Smart India Hackathon 2026 — Problem SIH26044
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Where Ayush Expertise<br />
              <span className="text-ayush-accent">Meets Opportunity</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-2xl">
              India's first dedicated placement platform for Ayurveda, Yoga, Unani, Siddha and Homeopathy graduates — connecting colleges, students and healthcare industry with Ayush-specific skill intelligence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary btn-lg text-base shadow-xl">
                Get Started Free →
              </Link>
              <Link to="/login" className="btn btn-lg bg-white/10 text-white hover:bg-white/20 border border-white/30 text-base">
                Demo Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────── */}
      <section className="bg-ayush-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display font-bold text-3xl text-white">{s.value}</div>
                <div className="text-sm text-white/80 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ayush Skill Taxonomy Preview ─────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ayush-dark mb-4">
              Built Around Ayush Skills
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Unlike generic job portals, our platform understands Panchkarma, Nadi Pariksha, Hijama, Varma therapy and 40+ more Ayush-specific competencies — so skill-matching actually works.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {skills.map((s) => (
              <span
                key={s.name}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${systemColor[s.system] || 'bg-slate-100 text-slate-700'} border border-current/20`}
              >
                {s.name}
              </span>
            ))}
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-slate-200 text-slate-600">
              +34 more skills →
            </span>
          </div>

          {/* System legend */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {Object.entries(systemColor).map(([sys, cls]) => (
              <span key={sys} className={`px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
                {sys}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three Roles ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ayush-dark mb-4">
              One Portal, Three Stakeholders
            </h2>
            <p className="text-slate-600">A purpose-built workflow for every participant in the Ayush education-to-employment pipeline.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <div key={role.title} className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                <div className={`bg-gradient-to-br ${role.color} p-8 text-white`}>
                  <div className="text-4xl mb-3">{role.icon}</div>
                  <h3 className="font-display font-bold text-xl">{role.title}</h3>
                </div>
                <div className="p-6 bg-white">
                  <ul className="space-y-3 mb-6">
                    {role.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link to={role.href} className="btn-primary w-full justify-center">
                    {role.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="py-20 bg-ayush-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ayush-dark mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '📝', title: 'Register & Verify', desc: 'Students register and get verified by their college. Companies register and post opportunities.' },
              { step: '02', icon: '🏷️', title: 'Tag Ayush Skills', desc: 'Students select from 46 Ayush-specific skills. Companies define required skill sets for each role.' },
              { step: '03', icon: '🔍', title: 'Smart Matching', desc: 'Our engine computes a skill-match % score. Students see best-fit jobs; companies see top applicants first.' },
              { step: '04', icon: '✅', title: 'Apply & Track', desc: 'Students apply in one click. Track status from Applied → Shortlisted → Accepted with email alerts.' },
            ].map((s) => (
              <div key={s.step} className="card text-center">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-xs font-bold text-ayush-primary/50 mb-1">STEP {s.step}</div>
                <h3 className="font-semibold text-ayush-dark mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 bg-ayush-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Start Your Ayush Career Journey Today
          </h2>
          <p className="text-white/70 mb-8">
            Join the Ministry of Ayush's national platform connecting the next generation of Ayush practitioners with India's growing wellness and healthcare industry.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="btn btn-lg bg-ayush-accent text-white hover:bg-yellow-500 shadow-xl font-semibold">
              Create Free Account →
            </Link>
            <Link to="/login" className="btn btn-lg bg-white/10 text-white hover:bg-white/20 border border-white/30">
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-white/50 text-sm">
            Demo: student@ayushportal.demo / company@ayushportal.demo / college@ayushportal.demo — all passwords: Demo@1234
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-ayush-dark text-white/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>🌿 Ayush Placement Portal — SIH26044 | Ministry of Ayush, Government of India</p>
          <p className="mt-1 text-white/40">Built for Smart India Hackathon 2026 | Ayurveda · Yoga · Unani · Siddha · Homeopathy</p>
        </div>
      </footer>
    </div>
  )
}
