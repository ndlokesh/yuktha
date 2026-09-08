import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import { SkillTag, MatchScore, JobTypeBadge } from '../components/Badges'
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Building2,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Award,
  Compass,
  FileCheck,
  Search,
  Briefcase,
  TrendingUp,
  ChevronRight,
  HeartPulse,
  Sun,
  Flame,
  Activity,
  Layers,
} from 'lucide-react'

const allSkills = [
  { name: 'Panchkarma', system: 'Ayurveda' },
  { name: 'Nadi Pariksha (Pulse Diagnosis)', system: 'Ayurveda' },
  { name: 'Shirodhara', system: 'Ayurveda' },
  { name: 'Kshar Sutra', system: 'Ayurveda' },
  { name: 'Asana Instruction', system: 'Yoga & Naturopathy' },
  { name: 'Pranayama Therapy', system: 'Yoga & Naturopathy' },
  { name: 'Yoga Nidra', system: 'Yoga & Naturopathy' },
  { name: 'Hydrotherapy', system: 'Yoga & Naturopathy' },
  { name: 'Ilaj-bil-Dawa (Pharmacotherapy)', system: 'Unani' },
  { name: 'Hijama (Wet Cupping)', system: 'Unani' },
  { name: 'Varma Therapy', system: 'Siddha' },
  { name: 'Thokkanam (Massage)', system: 'Siddha' },
  { name: 'Case Taking & Repertorization', system: 'Homeopathy' },
  { name: 'Materia Medica', system: 'Homeopathy' },
  { name: 'Clinical Trials in Ayush', system: 'Research & Clinical' },
  { name: 'GCP Compliance & CTRI', system: 'Research & Clinical' },
]

const systems = [
  'All Systems',
  'Ayurveda',
  'Yoga & Naturopathy',
  'Unani',
  'Siddha',
  'Homeopathy',
  'Research & Clinical',
]

const roles = [
  {
    icon: GraduationCap,
    title: 'For Students & Scholars',
    roleTag: 'Graduates & Interns',
    gradient: 'from-emerald-600 to-teal-700',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    points: [
      'Take standardized technical & soft skill assessments',
      'Instant skill profile with radar chart & gap analysis',
      'Maintain verified digital portfolio with project showcase',
      'Apply to jobs with skill-compatibility match % scoring',
    ],
    cta: 'Register as Student',
    href: '/register?role=STUDENT',
  },
  {
    icon: Landmark,
    title: 'For Academicians & Faculty',
    roleTag: 'Professors & Researchers',
    gradient: 'from-cyan-600 to-blue-700',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    points: [
      'Sponsored faculty internships & industrial immersion',
      'Faculty Development Programs (FDPs) with industry experts',
      'Apply for industry collaborative research grants',
      'Provide corporate consultancy & expert advisory',
    ],
    cta: 'Register as Faculty',
    href: '/register?role=FACULTY',
  },
  {
    icon: Building2,
    title: 'For Industry & Recruiters',
    roleTag: 'Pharma, Tech & Hospitals',
    gradient: 'from-blue-600 to-indigo-700',
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    points: [
      'Post jobs, internships, apprenticeships & live projects',
      'Publish training programs & certification courses',
      'Candidate shortlisting based on verified skill compatibility',
      'Issue research RFPs & collaborate with top academia',
    ],
    cta: 'Register as Company',
    href: '/register?role=COMPANY',
  },
  {
    icon: Landmark,
    title: 'For Academic Institutions',
    roleTag: 'Colleges & Universities',
    gradient: 'from-purple-600 to-violet-700',
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    points: [
      'Monitor student skill development & gap benchmarks',
      'Track batch placement readiness & recruiter trends',
      'Verify student credentials and academic records',
      'Curriculum alignment insights powered by AI analytics',
    ],
    cta: 'Register Institution',
    href: '/register?role=COLLEGE',
  },
]

const stats = [
  { value: '46+', label: 'Ayush Skills', desc: 'Curated taxonomy across all streams', icon: Award },
  { value: '6', label: 'Ayush Streams', desc: 'Ayurveda, Yoga, Unani, Siddha, Homeopathy, Research', icon: Compass },
  { value: '100%', label: 'College Verified', desc: 'Every student verified by institution', icon: ShieldCheck },
  { value: 'Smart AI', label: 'Skill Matcher', desc: 'Precision scoring for placements', icon: Sparkles },
]

export default function Landing() {
  const { user } = useAuth()
  const [selectedSystem, setSelectedSystem] = useState('All Systems')

  const filteredSkills =
    selectedSystem === 'All Systems'
      ? allSkills
      : allSkills.filter((s) => s.system === selectedSystem)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      {/* Floating Active Session Banner */}
      {user && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/20 px-4 py-2.5 text-center text-xs flex items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Signed in as <strong>{user.name}</strong> ({user.role})
          </span>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-bold border border-emerald-500/30 transition-colors"
          >
            <span>Open {user.role.charAt(0) + user.role.slice(1).toLowerCase()} Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#062419] to-slate-950 text-white py-20 lg:py-28">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Smart India Hackathon 2026 · Problem SIH26044</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white">
                Where Ayush Expertise Meets{' '}
                <span className="bg-gradient-to-r from-amber-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                  National Opportunity
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                India's dedicated digital platform connecting Ayurveda, Yoga, Naturopathy, Unani,
                Siddha, and Homeopathy institutions with healthcare and pharmaceutical industry
                leaders through verified Ayush skill intelligence.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/register"
                  className="btn-accent px-6 py-3.5 text-sm font-bold rounded-xl flex items-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>Join the National Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/login"
                  className="btn-ghost-white px-5 py-3.5 text-sm font-semibold rounded-xl flex items-center gap-2"
                >
                  <span>1-Click Demo Logins</span>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </Link>
              </div>

              {/* Trust bar */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>College-Verified Profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ayush-Specific Taxonomy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Ministry Compliance Ready</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl shadow-emerald-950/50 text-slate-800">
                {/* Simulated Floating Card */}
                <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-900/20">
                        PS
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Dr. Priya Sharma</div>
                        <div className="text-xs text-slate-500">BAMS · Batch of 2025</div>
                      </div>
                    </div>
                    <MatchScore percent={94} />
                  </div>

                  <div className="mb-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Matched Competencies
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <SkillTag name="Panchkarma" system="Ayurveda" size="xs" />
                      <SkillTag name="Shirodhara" system="Ayurveda" size="xs" />
                      <SkillTag name="Clinical Trials" system="Research & Clinical" size="xs" />
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified by Gujarat Ayurved Univ.</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      ACTIVE
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Target Role</div>
                      <div className="text-xs font-bold text-slate-800">Ayurvedic Clinical Consultant</div>
                    </div>
                    <JobTypeBadge type="JOB" />
                  </div>
                </div>

                {/* Sub badge */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-300 px-2">
                  <span>AI Match Engine: 94% compatibility</span>
                  <span className="text-amber-300 font-semibold">Shortlisted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KPI Stats Strip ─────────────────────────────────────────── */}
      <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.label}
                className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/10 flex items-center gap-4 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-display font-black text-2xl text-white leading-tight">
                    {s.value}
                  </div>
                  <div className="text-xs font-bold text-slate-200 leading-tight">{s.label}</div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{s.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Ayush Skill Taxonomy Showcase ───────────────────────────── */}
      <section className="py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Core Innovation</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Standardized Competency Taxonomy
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Standard job portals treat Ayush as generic 'Healthcare'. Yuktha introduces a comprehensive 46+ skill
              ontology spanning classical systems, modern clinical research protocols, and data-driven pharmacology.
            </p>

            {/* Filter pills */}
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {systems.map((sys) => (
                <button
                  key={sys}
                  onClick={() => setSelectedSystem(sys)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedSystem === sys
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/40'
                      : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {sys}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Tag Cloud */}
          <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex flex-wrap gap-2.5 justify-center">
              {filteredSkills.map((s) => (
                <SkillTag key={s.name} name={s.name} system={s.system} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Four Stakeholders Section ─────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 border-y border-white/10 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wide uppercase mb-3">
              <span>Complete Ecosystem</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              One Unified Portal. Four Key Pillars.
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              Synchronizing students, academic faculty, corporate enterprises, and institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r) => {
              const Icon = r.icon
              return (
                <div
                  key={r.title}
                  className="bg-slate-900/80 rounded-3xl overflow-hidden border border-white/10 shadow-xl hover:border-emerald-500/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div>
                    <div className={`p-6 bg-gradient-to-br ${r.gradient} text-white`}>
                      <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 text-white shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                        {r.roleTag}
                      </span>
                      <h3 className="font-display font-bold text-lg mt-2 tracking-tight">{r.title}</h3>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <ul className="space-y-3 mb-6">
                        {r.points.map((p) => (
                          <li key={p} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      to={r.href}
                      className="w-full py-2.5 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 shadow-sm transition-all group cursor-pointer"
                    >
                      <span>{r.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-400" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 4-Step Flow ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              How the Collaboration Loop Works
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              From diagnostic assessment to verifiable credentials in 4 transparent stages
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: GraduationCap,
                title: 'Evaluate & Diagnose',
                desc: 'Students take standardized industry questionnaires. The engine produces dynamic radar charts vs. 75% benchmarks.',
              },
              {
                step: '02',
                icon: Award,
                title: 'Bridge Skill Gaps',
                desc: 'Enroll in company-published certifications and masterclasses to address identified technical & soft skill gaps.',
              },
              {
                step: '03',
                icon: Sparkles,
                title: 'Faculty & Industry R&D',
                desc: 'Academicians take on corporate sabbaticals, joint research grants, and expert consultancy RFPs.',
              },
              {
                step: '04',
                icon: FileCheck,
                title: 'Verified Placement',
                desc: 'Showcase digital portfolios with milestone feedback, mentor ratings, and institutional transcript verification.',
              },
            ].map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.step}
                  className="bg-slate-900/80 rounded-3xl p-6 border border-white/10 shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all relative overflow-hidden group"
                >
                  <div className="text-4xl font-display font-black text-slate-800/80 absolute top-4 right-4 select-none group-hover:text-emerald-500/20 transition-colors">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Stage {step.step}
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Instant Evaluation Personas CTA Strip ───────────────────── */}
      <section className="bg-gradient-to-br from-slate-950 via-[#062419] to-slate-950 text-white py-20 relative overflow-hidden border-t border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Turnkey Evaluation Platform · Smart India Hackathon 2026</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight">
            Instant 1-Click Persona Test-Drive
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Yuktha is fully pre-seeded with realistic data across students, research professors, pharmaceutical enterprises, and colleges.
          </p>

          {/* Direct Persona Launch Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
            {[
              { role: 'Student', name: 'Priya Sharma', icon: '🎓', path: '/login?demo=student', color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10' },
              { role: 'Faculty', name: 'Dr. Rajeshwari', icon: '🔬', path: '/login?demo=faculty', color: 'hover:border-cyan-500/50 hover:bg-cyan-500/10' },
              { role: 'Industry', name: 'Himalaya R&D', icon: '🏢', path: '/login?demo=company', color: 'hover:border-blue-500/50 hover:bg-blue-500/10' },
              { role: 'College', name: 'Gujarat Ayurved', icon: '🏛️', path: '/login?demo=college', color: 'hover:border-purple-500/50 hover:bg-purple-500/10' },
              { role: 'Admin', name: 'National Admin', icon: '🇮🇳', path: '/login?demo=admin', color: 'hover:border-amber-500/50 hover:bg-amber-500/10' },
            ].map((d) => (
              <Link
                key={d.role}
                to={d.path}
                className={`p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 transition-all text-left flex flex-col justify-between ${d.color}`}
              >
                <div className="text-xl mb-1">{d.icon}</div>
                <div>
                  <div className="text-xs font-bold text-white">{d.role}</div>
                  <div className="text-[10px] text-slate-400 truncate">{d.name}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-accent px-6 py-3 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xl shadow-amber-500/20"
            >
              <span>Register New Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/login"
              className="btn-ghost-white px-5 py-3 text-xs font-semibold rounded-xl"
            >
              Manual Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-white/10 py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-display font-bold text-white">Yuktha</span>
            <span>·</span>
            <span>SIH26044 Academia–Industry Collaboration</span>
            <span>·</span>
            <span>Smart India Hackathon 2026</span>
          </div>
          <div>Ministry of Ayush, Government of India. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
