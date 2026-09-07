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
    roleTag: 'Ayush Graduates',
    gradient: 'from-emerald-600 to-teal-700',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    points: [
      'Showcase verified traditional & clinical competencies',
      'Instant skill-match scoring for every job & internship',
      'Live application status updates with timeline tracker',
      'Official verification credentials backed by your college',
    ],
    cta: 'Register as Student',
    href: '/register?role=STUDENT',
  },
  {
    icon: Building2,
    title: 'For Ayush Industry',
    roleTag: 'Pharma & Hospitals',
    gradient: 'from-blue-600 to-indigo-700',
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
    points: [
      'Post jobs with specific Ayush skill requirements',
      'Filter verified BAMS, BHMS, BUMS, BNYS graduates instantly',
      'View applicants pre-ranked by exact skill-match %',
      'Streamlined shortlisting and hiring workflow',
    ],
    cta: 'Register as Company',
    href: '/register?role=COMPANY',
  },
  {
    icon: Landmark,
    title: 'For Academic Institutions',
    roleTag: 'Colleges & Universities',
    gradient: 'from-purple-600 to-violet-700',
    iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
    points: [
      'Verify student credentials and academic enrollment',
      'Real-time batch placement rates & hiring company stats',
      'Track demand trends for syllabus alignment',
      'Generate Ministry of Ayush compliance analytics',
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

  if (user) return <Navigate to="/dashboard" replace />

  const filteredSkills =
    selectedSystem === 'All Systems'
      ? allSkills
      : allSkills.filter((s) => s.system === selectedSystem)

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800">
      <Navbar />

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

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
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
                className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-900/5 border border-slate-200/80 flex items-center gap-4 hover:border-emerald-500/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-display font-black text-2xl text-slate-900 leading-tight">
                    {s.value}
                  </div>
                  <div className="text-xs font-bold text-slate-700 leading-tight">{s.label}</div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{s.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Ayush Skill Taxonomy Showcase ───────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
              Core Innovation
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              A Native Ayush Skill Taxonomy
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Standard job boards categorize Ayush as generic 'Healthcare'. Our portal has a 46+ skill
              ontology spanning Ayurveda, Yoga, Unani, Siddha, Homeopathy, and modern Ayush clinical trials.
            </p>

            {/* Filter pills */}
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {systems.map((sys) => (
                <button
                  key={sys}
                  onClick={() => setSelectedSystem(sys)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedSystem === sys
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {sys}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Tag Cloud */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
            <div className="flex flex-wrap gap-2.5 justify-center">
              {filteredSkills.map((s) => (
                <SkillTag key={s.name} name={s.name} system={s.system} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Stakeholders Section ─────────────────────────────── */}
      <section className="py-20 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold tracking-wide uppercase mb-3">
              Complete Ecosystem
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              One Unified Portal. Three Critical Roles.
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Connecting academic verification with enterprise hiring and scholar aspirations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((r) => {
              const Icon = r.icon
              return (
                <div
                  key={r.title}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Card Header */}
                  <div className={`p-8 bg-gradient-to-br ${r.gradient} text-white`}>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                      {r.roleTag}
                    </span>
                    <h3 className="font-display font-bold text-xl mt-2 tracking-tight">{r.title}</h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <ul className="space-y-3.5 mb-8">
                      {r.points.map((p) => (
                        <li key={p} className="flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={r.href}
                      className="btn-secondary w-full justify-center py-3 text-xs font-bold rounded-xl flex items-center gap-2 group hover:border-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      <span>{r.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 4-Step Flow ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              How the Collaboration Loop Works
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              From academic enrollment to verified placement in 4 transparent stages
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: GraduationCap,
                title: 'Register & Verify',
                desc: 'Student registers with college details. College verifies student credentials to activate account.',
              },
              {
                step: '02',
                icon: Award,
                title: 'Map Ayush Skills',
                desc: 'Pick verified skills from the 46+ taxonomy. Companies configure required skills per opening.',
              },
              {
                step: '03',
                icon: Sparkles,
                title: 'Algorithm Match',
                desc: 'Our engine calculates real-time overlap score. Best matched candidates prioritized for interviews.',
              },
              {
                step: '04',
                icon: FileCheck,
                title: 'Placement & Analytics',
                desc: '1-click apply, live candidate status tracking, and national placement analytics for the Ministry.',
              },
            ].map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.step}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="text-4xl font-display font-black text-slate-100 absolute top-4 right-4 select-none">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    Stage {step.step}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Ministry Bottom CTA ────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-950 via-[#062419] to-slate-950 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Digital India Initiative · Ministry of Ayush</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight">
            Accelerate Your Ayush Career Today
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Whether you are a scholar looking for clinical internships, an Ayurveda manufacturer
            seeking R&D specialists, or a college administrator tracking placements — get started now.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="btn-accent px-8 py-3.5 text-sm font-bold rounded-xl flex items-center gap-2 shadow-xl shadow-amber-500/20"
            >
              <span>Create Account Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="btn-ghost-white px-6 py-3.5 text-sm font-semibold rounded-xl"
            >
              Sign In to Existing Account
            </Link>
          </div>

          {/* Pre-seeded Demo notice */}
          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-400">
            <span>Evaluation credentials ready: </span>
            <span className="text-emerald-300 font-mono">student@ayushportal.demo</span>
            <span className="mx-2">·</span>
            <span className="text-amber-300 font-mono">company@ayushportal.demo</span>
            <span className="mx-2">·</span>
            <span className="text-purple-300 font-mono">college@ayushportal.demo</span>
            <span className="block mt-1 text-slate-500">All passwords: Demo@1234</span>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-white/10 py-10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-display font-bold text-white">Ayush Portal</span>
            <span>·</span>
            <span>Problem SIH26044</span>
            <span>·</span>
            <span>Smart India Hackathon 2026</span>
          </div>
          <div>Ministry of Ayush, Government of India. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
