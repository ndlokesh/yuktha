import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Hero3DCanvas from '../components/Hero3DCanvas'
import { SkillTag } from '../components/Badges'
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
  Activity,
  Layers,
  FlaskConical,
  Users,
  Check,
  Zap,
} from 'lucide-react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts'

// Standardized Ayush Skill Taxonomy (46+ skills across 6 systems)
const allSkills = [
  // Ayurveda
  { name: 'Panchkarma', system: 'Ayurveda', level: 'Clinical' },
  { name: 'Nadi Pariksha (Pulse Diagnosis)', system: 'Ayurveda', level: 'Classical Diagnostic' },
  { name: 'Shirodhara', system: 'Ayurveda', level: 'Therapeutic' },
  { name: 'Kshar Sutra', system: 'Ayurveda', level: 'Para-Surgical' },
  { name: 'Rasashastra (Herbo-Mineral)', system: 'Ayurveda', level: 'Pharmaceutics' },
  { name: 'Dravyaguna (Herbal Pharmacology)', system: 'Ayurveda', level: 'Pharmacology' },
  { name: 'Agada Tantra (Toxicology)', system: 'Ayurveda', level: 'Toxicology' },
  { name: 'Swasthavritta (Preventive Diet)', system: 'Ayurveda', level: 'Lifestyle Medicine' },

  // Yoga & Naturopathy
  { name: 'Asana Instruction', system: 'Yoga & Naturopathy', level: 'Therapeutic Yoga' },
  { name: 'Pranayama Therapy', system: 'Yoga & Naturopathy', level: 'Breathwork' },
  { name: 'Yoga Nidra', system: 'Yoga & Naturopathy', level: 'Psychosomatic' },
  { name: 'Hydrotherapy', system: 'Yoga & Naturopathy', level: 'Naturopathy' },
  { name: 'Mud Therapy & Packs', system: 'Yoga & Naturopathy', level: 'Naturopathy' },
  { name: 'Dietetics & Fasting Therapy', system: 'Yoga & Naturopathy', level: 'Nutrition' },
  { name: 'Acupressure & Reflexology', system: 'Yoga & Naturopathy', level: 'Manual Therapy' },

  // Unani
  { name: 'Ilaj-bil-Dawa (Pharmacotherapy)', system: 'Unani', level: 'Pharmacotherapy' },
  { name: 'Hijama (Wet Cupping)', system: 'Unani', level: 'Regimental' },
  { name: 'Ilaj-bil-Tadbeer', system: 'Unani', level: 'Physical Therapy' },
  { name: 'Nabz (Pulse Diagnosis)', system: 'Unani', level: 'Diagnostic' },
  { name: 'Kulliyat (Constitutional Theory)', system: 'Unani', level: 'Theory' },
  { name: 'Qabalat (Unani Obstetrics)', system: 'Unani', level: 'Maternal Health' },

  // Siddha
  { name: 'Varma Therapy', system: 'Siddha', level: 'Vital Energy Points' },
  { name: 'Thokkanam (Physical Manipulation)', system: 'Siddha', level: 'Manual Therapy' },
  { name: 'Envagai Thervu (8-Fold Exam)', system: 'Siddha', level: 'Diagnostic' },
  { name: 'Muppu (Mineral Alchemy)', system: 'Siddha', level: 'Pharmaceutics' },
  { name: 'Gunapadam (Siddha Pharmacology)', system: 'Siddha', level: 'Formulation' },

  // Homeopathy
  { name: 'Case Taking & Repertorization', system: 'Homeopathy', level: 'Clinical' },
  { name: 'Materia Medica', system: 'Homeopathy', level: 'Pathogenesis' },
  { name: 'Organon & Philosophy', system: 'Homeopathy', level: 'Philosophy' },
  { name: 'Potentization & Pharmacy', system: 'Homeopathy', level: 'Preparation' },
  { name: 'Miasmatic Analysis', system: 'Homeopathy', level: 'Pathology' },

  // Research & Clinical
  { name: 'Clinical Trials in Ayush', system: 'Research & Clinical', level: 'GCP Protocols' },
  { name: 'GCP Compliance & CTRI', system: 'Research & Clinical', level: 'Regulatory' },
  { name: 'Pharmacovigilance & PSUR', system: 'Research & Clinical', level: 'Safety Monitoring' },
  { name: 'HPLC / HPTLC Standardization', system: 'Research & Clinical', level: 'Analytical QC' },
  { name: 'Phytochemical Extraction', system: 'Research & Clinical', level: 'Natural Products' },
  { name: 'Biostatistics & R/Python', system: 'Research & Clinical', level: 'Informatics' },
  { name: 'Scientific Manuscript Writing', system: 'Research & Clinical', level: 'Academic' },
  { name: 'Ayush EHR & Health Informatics', system: 'Research & Clinical', level: 'Digital Health' },
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

// Radar chart benchmark presets
const radarPresets = {
  practitioner: {
    label: 'Ayurvedic Clinical Practitioner',
    tag: 'BAMS Graduate · Primary Healthcare',
    data: [
      { category: 'Classical Therapeutics', score: 92, benchmark: 75 },
      { category: 'Clinical Trials & GCP', score: 68, benchmark: 75 },
      { category: 'Regulatory & PSUR', score: 64, benchmark: 75 },
      { category: 'Lab & HPLC Quality', score: 72, benchmark: 75 },
      { category: 'Digital Health & EHR', score: 85, benchmark: 75 },
      { category: 'Patient Consultation', score: 90, benchmark: 75 },
    ],
    peak: 'Classical Therapeutics (92%)',
    gap: 'Regulatory Compliance & PSUR (64%)',
    recommendation: 'Complete the 6-week CTRI & Pharmacovigilance Masterclass to bridge this gap.',
  },
  researcher: {
    label: 'Clinical Research Associate (CRA)',
    tag: 'M.D. Ayush · Clinical Trials & GCP',
    data: [
      { category: 'Classical Therapeutics', score: 78, benchmark: 75 },
      { category: 'Clinical Trials & GCP', score: 95, benchmark: 75 },
      { category: 'Regulatory & PSUR', score: 88, benchmark: 75 },
      { category: 'Lab & HPLC Quality', score: 91, benchmark: 75 },
      { category: 'Digital Health & EHR', score: 82, benchmark: 75 },
      { category: 'Patient Consultation', score: 74, benchmark: 75 },
    ],
    peak: 'Clinical Trials & GCP Protocols (95%)',
    gap: 'Patient Consultation & Communication (74%)',
    recommendation: 'Surpasses 75% benchmark across all analytical and clinical trial dimensions.',
  },
  formulation: {
    label: 'Phyto-Pharmaceutical Scientist',
    tag: 'M.Pharm / Ph.D · Drug R&D',
    data: [
      { category: 'Classical Therapeutics', score: 86, benchmark: 75 },
      { category: 'Clinical Trials & GCP', score: 70, benchmark: 75 },
      { category: 'Regulatory & PSUR', score: 84, benchmark: 75 },
      { category: 'Lab & HPLC Quality', score: 96, benchmark: 75 },
      { category: 'Digital Health & EHR', score: 66, benchmark: 75 },
      { category: 'Patient Consultation', score: 72, benchmark: 75 },
    ],
    peak: 'Lab & HPLC Quality Control (96%)',
    gap: 'Digital Health & EHR Systems (66%)',
    recommendation: 'Targeted for senior formulation scientist roles across top pharmaceutical enterprises.',
  },
}

// 4 Core Ecosystem Pillars
const pillars = [
  {
    icon: GraduationCap,
    title: 'Students & Scholars',
    roleTag: 'Graduates & Interns',
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    desc: 'Take standardized diagnostic skill evaluations, identify competency gaps, build a verified digital portfolio, and apply for high-value jobs.',
    points: [
      '20-Question diagnostic skill assessments',
      'Competency radar against 75% industry benchmark',
      'Verified digital portfolio & credentials',
      'AI skill-compatibility job matching',
    ],
    ctaText: 'Register as Student',
    ctaLink: '/register?role=STUDENT',
  },
  {
    icon: Landmark,
    title: 'Academicians & Faculty',
    roleTag: 'Professors & Researchers',
    gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    border: 'border-cyan-500/20 hover:border-cyan-500/40',
    iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    desc: 'Access sponsored corporate sabbaticals, submit collaborative research proposals to pharmaceutical sponsors, and lead accredited FDP programs.',
    points: [
      'Sponsored 2-6 month industry sabbaticals',
      'Bid on corporate collaborative R&D grants',
      'Corporate advisory & expert consultancies',
      'Accredited Faculty Development Programs',
    ],
    ctaText: 'Register as Faculty',
    ctaLink: '/register?role=FACULTY',
  },
  {
    icon: Building2,
    title: 'Industry & Corporates',
    roleTag: 'Pharma & Ayush Hospitals',
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    desc: 'Discover verified Ayush graduates with precision skill compatibility, sponsor applied clinical research, and publish accredited learning programs.',
    points: [
      'Precision talent search with match thresholds (>80%)',
      'Post jobs, fellowships, and internships',
      'Issue research RFPs to top university labs',
      'Publish company certification courses',
    ],
    ctaText: 'Partner as Industry',
    ctaLink: '/register?role=COMPANY',
  },
  {
    icon: ShieldCheck,
    title: 'Academic Institutions',
    roleTag: 'Colleges & Universities',
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    desc: 'Track cohort skill benchmarks, align curriculum with industry demands for NAAC/NIRF accreditation, and verify student credentials.',
    points: [
      'Batch-level competency diagnostic analytics',
      'Dean verification for transcripts and portfolios',
      'Curriculum gap tracking for NAAC & NIRF',
      'Institutional placement readiness index',
    ],
    ctaText: 'Register Institution',
    ctaLink: '/register?role=COLLEGE',
  },
]

export default function Landing() {
  const { user } = useAuth()
  const [selectedSystem, setSelectedSystem] = useState('All Systems')
  const [skillSearchQuery, setSkillSearchQuery] = useState('')
  const [activeRadarKey, setActiveRadarKey] = useState('practitioner')

  const currentRadar = radarPresets[activeRadarKey]

  // Filter skills
  const filteredSkills = useMemo(() => {
    return allSkills.filter((s) => {
      const matchSys = selectedSystem === 'All Systems' || s.system === selectedSystem
      const matchSearch =
        skillSearchQuery.trim() === '' ||
        s.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) ||
        s.level.toLowerCase().includes(skillSearchQuery.toLowerCase())
      return matchSys && matchSearch
    })
  }, [selectedSystem, skillSearchQuery])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />

      {/* Active User Session Banner (if already logged in) */}
      {user && (
        <div className="bg-slate-900/90 border-b border-white/10 px-4 py-2 text-center text-xs flex items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Signed in as <strong>{user.name}</strong> ({user.role})
          </span>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── 1. Hero Section with 3D Animated Visual Centerpiece ────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#051a12] to-slate-950 pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Clean Single SIH Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Smart India Hackathon 2026 · Problem SIH26044</span>
              </div>

              {/* Magnificent Headline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white">
                Connecting Traditional{' '}
                <span className="bg-gradient-to-r from-amber-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                  Ayush Medicine
                </span>{' '}
                with Modern Healthcare Enterprise
              </h1>

              {/* Crisp Narrative Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                India's centralized portal bridging the structural divide between academia and industry.
                Empowering students with verified skill intelligence, faculty with corporate R&D sabbaticals,
                and pharmaceutical enterprises with job-ready Ayush talent.
              </p>

              {/* Clear, Professional CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="btn-accent px-6 py-3.5 text-sm font-bold rounded-xl flex items-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>Explore Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#taxonomy"
                  className="btn-ghost-white px-5 py-3.5 text-sm font-semibold rounded-xl flex items-center gap-2 border border-white/15 hover:border-emerald-500/40"
                >
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>View Skill Taxonomy</span>
                </a>
              </div>

              {/* Clean Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>NAMSTP Taxonomy Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>CTRI & GCP Protocol Aligned</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>University-Verified Credentials</span>
                </div>
              </div>
            </div>

            {/* Right Column: Heroic 3D Animated Canvas */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <Hero3DCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Impact Metrics Strip (Clean & Spacious) ──────────────── */}
      <section className="bg-slate-900/60 border-y border-white/10 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                value: '46+',
                label: 'Standardized Ayush Skills',
                desc: 'Curated taxonomy across all 6 classical streams',
                icon: Award,
                color: 'text-amber-400',
              },
              {
                value: '6',
                label: 'Ayush Systems',
                desc: 'Ayurveda, Yoga, Unani, Siddha, Homeopathy & Research',
                icon: Compass,
                color: 'text-emerald-400',
              },
              {
                value: '100%',
                label: 'Institutional Verification',
                desc: 'Every student credential signed by accredited dean',
                icon: ShieldCheck,
                color: 'text-cyan-400',
              },
              {
                value: '₹2.5 Cr+',
                label: 'Active Industry Grants',
                desc: 'Sponsored collaborative R&D & faculty sabbaticals',
                icon: FlaskConical,
                color: 'text-purple-400',
              },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="bg-slate-900/80 rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-3xl font-black text-white font-display">
                      {stat.value}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-200">{stat.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{stat.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Four Core Ecosystem Pillars ──────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-3">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Complete Collaboration Loop</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              One Unified Portal. Four Empowered Pillars.
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Yuktha synchronizes the entire Ayush education and corporate lifecycle into a single
              transparent ecosystem.
            </p>
          </div>

          {/* 4 Spacious, Clean Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => {
              const Icon = p.icon
              return (
                <div
                  key={p.title}
                  className={`bg-slate-900/70 rounded-3xl p-6 border ${p.border} transition-all duration-300 flex flex-col justify-between hover:-translate-y-1`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-5 ${p.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                      {p.roleTag}
                    </div>

                    <h3 className="font-display font-bold text-lg text-white mb-2 tracking-tight">
                      {p.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      {p.desc}
                    </p>

                    <div className="space-y-2.5 pb-6 border-t border-white/5 pt-4">
                      {p.points.map((pt) => (
                        <div key={pt} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={p.ctaLink}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors group"
                  >
                    <span>{p.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-400" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Objective Skill Gap & Competency Radar ────────────────── */}
      <section className="py-24 bg-gradient-to-b from-slate-950 via-[#051c14] to-slate-950 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Core Innovation · SIH26044</span>
              </div>

              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                Objective Skill Gap Diagnosis vs. 75% Industry Benchmark
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Rather than relying on unverified resume claims, Yuktha measures candidate competence
                across six foundational Ayush vectors against vetted pharmaceutical industry standards.
              </p>

              {/* Profile Selector Tabs */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Competency Profile:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'practitioner', label: 'BAMS Clinical', desc: 'Practitioner' },
                    { key: 'researcher', label: 'Clinical Trials', desc: 'GCP & CTRI' },
                    { key: 'formulation', label: 'Phyto-Chemist', desc: 'HPLC & QC' },
                  ].map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setActiveRadarKey(p.key)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        activeRadarKey === p.key
                          ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{p.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Diagnostic Breakdown */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/10">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Peak Competency</div>
                  <div className="text-sm font-bold text-white mt-1">{currentRadar.peak}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Exceeds industry readiness baseline</div>
                </div>

                <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/10">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Critical Skill Gap</div>
                  <div className="text-sm font-bold text-white mt-1">{currentRadar.gap}</div>
                  <div className="text-[10px] text-amber-300/80 mt-1">Flagged for targeted upskilling</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/register?role=STUDENT"
                  className="btn-accent px-6 py-3.5 text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-xl shadow-amber-500/20"
                >
                  <span>Take Diagnostic Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Recharts Radar Visualization */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div>
                    <div className="text-sm font-bold text-white">{currentRadar.label}</div>
                    <div className="text-xs text-slate-400">{currentRadar.tag}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    6 EVALUATION VECTORS
                  </span>
                </div>

                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={currentRadar.data}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis
                        dataKey="category"
                        stroke="#94a3b8"
                        tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 600 }}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 9 }} />
                      <Radar
                        name="Candidate Competency (%)"
                        dataKey="score"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.4}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Industry Benchmark (75%)"
                        dataKey="benchmark"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.12}
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#fff',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    <span>Candidate Vector</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span>75% Industry Benchmark</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Standardized 46+ Competency Taxonomy (Neat & Clean) ───── */}
      <section id="taxonomy" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Standardized Taxonomy</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              46+ Curated Ayush Competencies
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Yuktha moves beyond generic 'healthcare' categories by introducing an Ayush-specific ontology
              spanning classical systems, clinical trials, and pharmacology.
            </p>

            {/* Clean Search & Filter Controls */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search competencies (e.g. Panchkarma, GCP, HPLC)..."
                  value={skillSearchQuery}
                  onChange={(e) => setSkillSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {systems.map((sys) => (
                  <button
                    key={sys}
                    onClick={() => setSelectedSystem(sys)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedSystem === sys
                        ? 'bg-emerald-600 text-white shadow-md border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border border-white/10 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {sys}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Tag Cloud */}
          <div className="bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-white/10">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 text-xs text-slate-400">
              <span>
                Showing <strong className="text-white">{filteredSkills.length}</strong> competencies
              </span>
              <span className="text-[11px] text-emerald-400">
                Aligned with Ministry of Ayush NAMSTP Standard
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              {filteredSkills.map((s) => (
                <div
                  key={s.name}
                  className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-500/40 transition-all"
                >
                  <SkillTag name={s.name} system={s.system} />
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors">
                    {s.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. 4-Stage Collaboration Architecture ───────────────────── */}
      <section className="py-24 bg-gradient-to-b from-slate-900/40 to-slate-950 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              How the Collaboration Loop Works
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              A transparent, verifiable pathway from skill evaluation to industry placement
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: GraduationCap,
                title: 'Diagnose & Benchmark',
                desc: 'Students take standardized questionnaires. The engine produces dynamic radar charts benchmarking against the 75% baseline.',
              },
              {
                step: '02',
                icon: Award,
                title: 'Bridge Skill Gaps',
                desc: 'Enroll in company-published certifications and masterclasses to address identified technical and soft skill gaps.',
              },
              {
                step: '03',
                icon: FlaskConical,
                title: 'Faculty & Industry R&D',
                desc: 'Academicians take on corporate sabbaticals, joint research grants, and expert consultancy RFPs.',
              },
              {
                step: '04',
                icon: FileCheck,
                title: 'Verified Placement',
                desc: 'Showcase digital portfolios with milestone feedback, mentor ratings, and institutional transcript verification.',
              },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.step}
                  className="bg-slate-900/80 rounded-3xl p-6 border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1 transition-all relative overflow-hidden group"
                >
                  <div className="text-4xl font-display font-black text-slate-800 absolute top-4 right-4 select-none group-hover:text-emerald-500/20 transition-colors">
                    {s.step}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Stage {s.step}
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 7. Clean, Inspiring Call to Action Banner ────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>National Ayush Collaboration Initiative</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Ready to Bridge the Academia–Industry Divide?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join thousands of students, researchers, and healthcare enterprises bridging India's
            traditional medicine and modern clinical industry gap.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-accent px-7 py-3.5 text-sm font-bold rounded-xl flex items-center gap-2 shadow-xl shadow-amber-500/20"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="btn-ghost-white px-6 py-3.5 text-sm font-semibold rounded-xl border border-white/15"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. Official Footer ──────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-white/10 py-10 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-display font-extrabold text-white text-base tracking-tight">Yuktha</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">Unified Academia–Industry Collaboration Portal</span>
            </div>
            <div className="flex flex-wrap gap-4 text-slate-400 text-[11px]">
              <Link to="/register?role=STUDENT" className="hover:text-white">Students</Link>
              <Link to="/register?role=FACULTY" className="hover:text-white">Academicians</Link>
              <Link to="/register?role=COMPANY" className="hover:text-white">Enterprises</Link>
              <Link to="/register?role=COLLEGE" className="hover:text-white">Institutions</Link>
              <Link to="/login" className="hover:text-white">Sign In</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              Smart India Hackathon 2026 · Problem Statement SIH26044 · Ministry of Ayush, Government of India
            </div>
            <div className="text-slate-500">
              Developed for National Ayush Innovation & Skill Integration.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
