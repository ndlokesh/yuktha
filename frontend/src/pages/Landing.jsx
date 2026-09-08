import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
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
  Activity,
  Layers,
  FlaskConical,
  Users,
  BookOpen,
  Zap,
  Sliders,
  Check,
  ExternalLink,
  AlertTriangle,
  Clock,
  Lock,
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

// Complete curated Ayush Skill Taxonomy (46+ skills across 6 domains)
const allSkills = [
  // Ayurveda
  { name: 'Panchkarma', system: 'Ayurveda', level: 'Core Clinical' },
  { name: 'Nadi Pariksha (Pulse Diagnosis)', system: 'Ayurveda', level: 'Classical Diagnostic' },
  { name: 'Shirodhara', system: 'Ayurveda', level: 'Therapeutic Procedure' },
  { name: 'Kshar Sutra', system: 'Ayurveda', level: 'Surgical & Para-Surgical' },
  { name: 'Rasashastra (Herbo-Mineral Formulations)', system: 'Ayurveda', level: 'Pharmaceutics' },
  { name: 'Dravyaguna (Herbal Pharmacology)', system: 'Ayurveda', level: 'Materia Medica' },
  { name: 'Agada Tantra (Ayurvedic Toxicology)', system: 'Ayurveda', level: 'Clinical Toxicology' },
  { name: 'Swasthavritta (Preventive Health & Dietetics)', system: 'Ayurveda', level: 'Lifestyle Medicine' },

  // Yoga & Naturopathy
  { name: 'Asana Instruction', system: 'Yoga & Naturopathy', level: 'Therapeutic Yoga' },
  { name: 'Pranayama Therapy', system: 'Yoga & Naturopathy', level: 'Breathwork & Energy' },
  { name: 'Yoga Nidra', system: 'Yoga & Naturopathy', level: 'Psychosomatic Therapy' },
  { name: 'Hydrotherapy', system: 'Yoga & Naturopathy', level: 'Naturopathic Modality' },
  { name: 'Mud Therapy & Packs', system: 'Yoga & Naturopathy', level: 'Naturopathic Modality' },
  { name: 'Dietetics & Fasting Therapy', system: 'Yoga & Naturopathy', level: 'Nutritional Medicine' },
  { name: 'Acupressure & Reflexology', system: 'Yoga & Naturopathy', level: 'Manual Therapy' },

  // Unani
  { name: 'Ilaj-bil-Dawa (Pharmacotherapy)', system: 'Unani', level: 'Clinical Pharmacotherapy' },
  { name: 'Hijama (Wet Cupping / Regimental Therapy)', system: 'Unani', level: 'Regimental Modality' },
  { name: 'Ilaj-bil-Tadbeer (Regimental Therapy)', system: 'Unani', level: 'Physical Therapeutics' },
  { name: 'Nabz (Pulse Diagnosis in Unani)', system: 'Unani', level: 'Diagnostic Modality' },
  { name: 'Kulliyat (Principles of Medicine & Mizaj)', system: 'Unani', level: 'Constitutional Theory' },
  { name: 'Qabalat (Unani Obstetrics)', system: 'Unani', level: 'Maternal Health' },

  // Siddha
  { name: 'Varma Therapy', system: 'Siddha', level: 'Vital Point Energy Therapy' },
  { name: 'Thokkanam (Physical Manipulation)', system: 'Siddha', level: 'Manual Therapy' },
  { name: 'Envagai Thervu (Eightfold Examination)', system: 'Siddha', level: 'Classical Diagnostic' },
  { name: 'Muppu (Alchemical Formulation)', system: 'Siddha', level: 'Higher Mineral Alchemy' },
  { name: 'Gunapadam (Siddha Pharmacology)', system: 'Siddha', level: 'Drug Formulation' },

  // Homeopathy
  { name: 'Case Taking & Repertorization', system: 'Homeopathy', level: 'Clinical Assessment' },
  { name: 'Materia Medica', system: 'Homeopathy', level: 'Remedy Pathogenesis' },
  { name: 'Organon of Medicine & Philosophy', system: 'Homeopathy', level: 'Therapeutic Philosophy' },
  { name: 'Potentization & Pharmacy', system: 'Homeopathy', level: 'Pharmaceutical Preparation' },
  { name: 'Miasmatic Analysis', system: 'Homeopathy', level: 'Constitutional Pathology' },

  // Research & Clinical
  { name: 'Clinical Trials in Ayush', system: 'Research & Clinical', level: 'GCP & Trial Design' },
  { name: 'GCP Compliance & CTRI', system: 'Research & Clinical', level: 'Regulatory Protocol' },
  { name: 'Pharmacovigilance & PSUR', system: 'Research & Clinical', level: 'Adverse Event Monitoring' },
  { name: 'HPLC / HPTLC Standardization', system: 'Research & Clinical', level: 'Analytical Chemistry' },
  { name: 'Phytochemical Extraction & QC', system: 'Research & Clinical', level: 'Natural Product QC' },
  { name: 'Biostatistics & R/Python Analysis', system: 'Research & Clinical', level: 'Clinical Informatics' },
  { name: 'Scientific Manuscript Writing', system: 'Research & Clinical', level: 'Academic Dissemination' },
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

// Simulator Presets
const simulatorPresets = [
  {
    id: 'ayurveda',
    stream: 'Ayurveda',
    targetRole: 'Senior Ayurvedic Clinical Consultant',
    company: 'Himalaya Wellness R&D',
    baseSalary: '₹8.5 – ₹12.0 LPA',
    recommendedSkills: ['Panchkarma', 'Nadi Pariksha (Pulse Diagnosis)', 'Shirodhara', 'Clinical Trials in Ayush', 'GCP Compliance & CTRI'],
    gapWarning: 'Missing CTRI & Biostatistics for Tier-1 Clinical Trial Lead roles',
    potentialBoost: '+18% placement match',
  },
  {
    id: 'research',
    stream: 'Research & Clinical',
    targetRole: 'Lead Ayush Clinical Research Associate (CRA)',
    company: 'Dabur India Clinical Division',
    baseSalary: '₹9.0 – ₹14.5 LPA',
    recommendedSkills: ['Clinical Trials in Ayush', 'GCP Compliance & CTRI', 'Pharmacovigilance & PSUR', 'HPLC / HPTLC Standardization', 'Biostatistics & R/Python Analysis'],
    gapWarning: 'Missing Pharmacovigilance & PSUR certification',
    potentialBoost: '+22% CTC premium',
  },
  {
    id: 'formulation',
    stream: 'Ayurveda & Phyto',
    targetRole: 'Phyto-Pharmaceutical Formulation Scientist',
    company: 'Charak Pharma Labs',
    baseSalary: '₹7.8 – ₹11.5 LPA',
    recommendedSkills: ['Rasashastra (Herbo-Mineral Formulations)', 'Phytochemical Extraction & QC', 'HPLC / HPTLC Standardization', 'Dravyaguna (Herbal Pharmacology)'],
    gapWarning: 'Add HPLC Analytical Protocol to unlock Senior Chemist band',
    potentialBoost: '+15% match rate',
  },
  {
    id: 'yoga',
    stream: 'Yoga & Naturopathy',
    targetRole: 'Integrative Wellness Director',
    company: 'Apollo Ayush Integrative Care',
    baseSalary: '₹8.0 – ₹13.0 LPA',
    recommendedSkills: ['Asana Instruction', 'Pranayama Therapy', 'Yoga Nidra', 'Dietetics & Fasting Therapy', 'Ayush EHR & Health Informatics'],
    gapWarning: 'Missing Digital EHR integration for hospital empanelment',
    potentialBoost: '+16% recruiter views',
  },
]

// Live Ticker items
const tickerFeed = [
  { text: 'Dr. Priya S. achieved 94% Compatibility Match for Ayurvedic Clinical Consultant', tag: 'Placement', color: 'emerald' },
  { text: 'Himalaya Wellness posted 4 Clinical Fellowships in Phyto-Chemistry (₹8.5 LPA)', tag: 'Job RFP', color: 'amber' },
  { text: 'Dr. Rajeshwari (Gujarat Ayurved Univ) initiated ₹25L Industry Collaborative Grant with Dabur', tag: 'R&D Grant', color: 'cyan' },
  { text: 'National Institute of Ayurveda verified 52 student digital portfolios with Dean e-Sign', tag: 'Verification', color: 'purple' },
  { text: '14,200+ Ayush diagnostic evaluations completed across 48 accredited colleges nationwide', tag: 'Milestone', color: 'emerald' },
  { text: 'Charak Pharma opened 3 corporate sabbaticals in Pharmacovigilance & CTRI Protocols', tag: 'Faculty Immersion', color: 'blue' },
  { text: 'Ministry of Ayush standardized 46+ competencies under the NAMSTP Digital Framework', tag: 'GovTech', color: 'amber' },
]

// Radar chart benchmark presets
const radarPresets = {
  student: [
    { category: 'Classical Therapeutics', score: 92, benchmark: 75 },
    { category: 'Clinical Trials & GCP', score: 68, benchmark: 75 },
    { category: 'Regulatory & Pharmacovigilance', score: 64, benchmark: 75 },
    { category: 'Lab & HPLC Quality Control', score: 72, benchmark: 75 },
    { category: 'Digital Health & EHR', score: 85, benchmark: 75 },
    { category: 'Soft Skills & Consultation', score: 90, benchmark: 75 },
  ],
  researcher: [
    { category: 'Classical Therapeutics', score: 78, benchmark: 75 },
    { category: 'Clinical Trials & GCP', score: 95, benchmark: 75 },
    { category: 'Regulatory & Pharmacovigilance', score: 88, benchmark: 75 },
    { category: 'Lab & HPLC Quality Control', score: 91, benchmark: 75 },
    { category: 'Digital Health & EHR', score: 82, benchmark: 75 },
    { category: 'Soft Skills & Consultation', score: 76, benchmark: 75 },
  ],
  formulation: [
    { category: 'Classical Therapeutics', score: 86, benchmark: 75 },
    { category: 'Clinical Trials & GCP', score: 70, benchmark: 75 },
    { category: 'Regulatory & Pharmacovigilance', score: 84, benchmark: 75 },
    { category: 'Lab & HPLC Quality Control', score: 96, benchmark: 75 },
    { category: 'Digital Health & EHR', score: 65, benchmark: 75 },
    { category: 'Soft Skills & Consultation', score: 72, benchmark: 75 },
  ],
}

// 4-Stakeholders with complete simulated interactive playground details
const personas = [
  {
    id: 'student',
    title: 'Students & Scholars',
    roleTag: 'Graduates & Interns',
    headline: 'Bridge the Academic Gap & Secure High-Value Ayush Placements',
    icon: GraduationCap,
    gradient: 'from-emerald-600 to-teal-700',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    demoLogin: '/login?demo=student',
    capabilities: [
      'Take 20-question standardized diagnostic skill assessments across clinical & soft skills',
      'Dynamic Radar Chart benchmarking individual competencies against 75% industry baseline',
      'Maintain college-verified digital portfolio with blockchain-verifiable credentials',
      'Instant job-compatibility match % calculation for pharma & hospital postings',
    ],
    previewData: {
      name: 'Dr. Priya Sharma',
      batch: 'BAMS · Batch of 2025 · Gujarat Ayurved Univ',
      technicalScore: '88%',
      softSkillScore: '92%',
      clinicalReadiness: 'High (85%)',
      topMatch: 'Ayurvedic Clinical Consultant · 94% Match',
      missingSkill: 'CTRI Protocol Compliance',
      status: 'Dean Verified & Active',
    },
  },
  {
    id: 'faculty',
    title: 'Academicians & Faculty',
    roleTag: 'Professors & Researchers',
    headline: 'Industry Sabbaticals, Sponsored Grants & Research Translation',
    icon: Landmark,
    gradient: 'from-cyan-600 to-blue-700',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    demoLogin: '/login?demo=faculty',
    capabilities: [
      'Apply for sponsored corporate sabbaticals & industrial immersion programs (2-6 months)',
      'Bid on industry collaborative R&D grants & RFPs directly from top pharmaceutical sponsors',
      'Deliver corporate advisory consultancies & commercial formulation development',
      'Conduct Faculty Development Programs (FDP) accredited by Ayush industry consortia',
    ],
    previewData: {
      name: 'Dr. Rajeshwari V.',
      batch: 'Professor of Rasashastra · 14 Yrs Experience',
      activeGrant: '₹25,00,000 · Dabur Phyto-Chemistry Grant',
      grantStatus: 'Under Industry Evaluation (Stage 2/3)',
      sabbaticalOpening: '2-Month Immersion · Himalaya Wellness',
      fdpCredits: '48 / 50 Ayush CEP Credits',
      status: 'Principal Investigator Empaneled',
    },
  },
  {
    id: 'company',
    title: 'Industry & Recruiters',
    roleTag: 'Pharma, Tech & Hospitals',
    headline: 'Source Verified Ayush Talent & Sponsor Applied Industry Research',
    icon: Building2,
    gradient: 'from-blue-600 to-indigo-700',
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    demoLogin: '/login?demo=company',
    capabilities: [
      'Filter candidates by verified competency scores with custom compatibility thresholds (>80%)',
      'Post jobs, internships, apprenticeships & clinical research assistantships',
      'Issue research RFPs & collaborate with premier academic laboratories nationwide',
      'Publish training courses & certifications to build pre-trained talent pipelines',
    ],
    previewData: {
      name: 'Himalaya Wellness R&D',
      batch: 'Pharmaceutical Enterprise · Bangalore Hub',
      activePostings: '6 Live Roles · 4 Fellowships',
      matchFilter: 'Filtering: Match Score ≥ 85%',
      pipelineCount: '18 Shortlisted Candidates',
      topCandidate: 'Dr. Priya Sharma (94% Compatibility)',
      status: 'Corporate Recruiter Verified',
    },
  },
  {
    id: 'college',
    title: 'Academic Institutions',
    roleTag: 'Colleges & Universities',
    headline: 'Institutional Skill Gap Analytics & Student Credential Verification',
    icon: ShieldCheck,
    gradient: 'from-purple-600 to-violet-700',
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    demoLogin: '/login?demo=college',
    capabilities: [
      'Dean console to review, endorse & verify student digital portfolios and transcripts',
      'Batch-level skill diagnostic heatmaps identifying curriculum gaps for NAAC & NIRF',
      'Track cohort placement readiness index & recruiter engagement analytics in real-time',
      'Direct MoUs and research consortium agreements with pharmaceutical enterprises',
    ],
    previewData: {
      name: 'Gujarat Ayurved University',
      batch: 'Institute of Post Graduate Teaching & Research',
      cohortSize: '240 Enrolled Scholars',
      readinessIndex: '88.4% Placement Ready',
      verificationQueue: '12 Pending Transcripts',
      topCurriculumGap: 'Pharmacovigilance Module Deficit',
      status: 'Accredited Institutional Console',
    },
  },
]

export default function Landing() {
  const { user } = useAuth()

  // Simulator State
  const [activePresetIndex, setActivePresetIndex] = useState(0)
  const currentPreset = simulatorPresets[activePresetIndex]

  const [selectedSimSkills, setSelectedSimSkills] = useState([
    'Panchkarma',
    'Nadi Pariksha (Pulse Diagnosis)',
    'Shirodhara',
  ])

  // Radar Sandbox State
  const [activeRadarPreset, setActiveRadarPreset] = useState('student')

  // Persona Playground State
  const [activePersonaTab, setActivePersonaTab] = useState('student')
  const currentPersona = personas.find((p) => p.id === activePersonaTab) || personas[0]

  // Skill Taxonomy Cloud State
  const [selectedSystem, setSelectedSystem] = useState('All Systems')
  const [skillSearchQuery, setSkillSearchQuery] = useState('')

  // Toggle skill in simulator
  const toggleSimSkill = (skillName) => {
    if (selectedSimSkills.includes(skillName)) {
      if (selectedSimSkills.length > 1) {
        setSelectedSimSkills(selectedSimSkills.filter((s) => s !== skillName))
      }
    } else {
      setSelectedSimSkills([...selectedSimSkills, skillName])
    }
  }

  // Calculate dynamic simulator match score
  const dynamicMatchScore = useMemo(() => {
    const base = 50
    const matchedCount = currentPreset.recommendedSkills.filter((s) =>
      selectedSimSkills.includes(s)
    ).length
    const score = Math.min(
      98,
      Math.round(base + (matchedCount / currentPreset.recommendedSkills.length) * 44 + (selectedSimSkills.length * 1.5))
    )
    return Math.min(score, 98)
  }, [currentPreset, selectedSimSkills])

  // Filter skills cloud
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

  // Stroke offset for animated SVG ring
  const circleCircumference = 2 * Math.PI * 45
  const strokeDashoffset = circleCircumference - (dynamicMatchScore / 100) * circleCircumference

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />

      {/* Floating Active Session Banner */}
      {user && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/20 px-4 py-2.5 text-center text-xs flex items-center justify-center gap-3 z-30 relative">
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
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#062016] to-slate-950 py-16 lg:py-24">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-12 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Smart India Hackathon 2026 · Problem SIH26044</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-white">
                Where Ayush Expertise Meets{' '}
                <span className="bg-gradient-to-r from-amber-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                  National Opportunity
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                India's centralized digital bridge connecting Ayurveda, Yoga, Unani, Siddha, and
                Homeopathy scholars with premier healthcare enterprises and clinical research labs
                through verified skill intelligence and collaborative R&D grants.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/register?role=STUDENT"
                  className="btn-accent px-6 py-3.5 text-sm font-bold rounded-xl flex items-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Start Skill Diagnostic</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/login"
                  className="btn-ghost-white px-5 py-3.5 text-sm font-semibold rounded-xl flex items-center gap-2 border border-white/15 hover:border-emerald-500/40"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>1-Click Demo Logins</span>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </Link>

                <a
                  href="#simulator"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Try Live Match Simulator ↓</span>
                </a>
              </div>

              {/* Live Metric Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <div className="text-lg font-black text-emerald-400 font-display">46+</div>
                  <div className="text-[11px] text-slate-300 font-medium">Ayush Skills</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <div className="text-lg font-black text-amber-400 font-display">6 Systems</div>
                  <div className="text-[11px] text-slate-300 font-medium">Full Taxonomy</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <div className="text-lg font-black text-cyan-400 font-display">100%</div>
                  <div className="text-[11px] text-slate-300 font-medium">Dean Verified</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <div className="text-lg font-black text-purple-400 font-display">₹2.5 Cr+</div>
                  <div className="text-[11px] text-slate-300 font-medium">R&D Grants</div>
                </div>
              </div>

              {/* Trust Bar */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>NAMSTP Terminology Aligned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>CTRI & GCP Protocol Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>NAAC / NIRF Skill Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Simulator Card */}
            <div id="simulator" className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-lg bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 border border-white/15 shadow-2xl shadow-emerald-950/80">
                {/* Header of Simulator */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Ayush Match Simulator</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          LIVE INTERACTIVE
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">Click skills to recalculate real-time placement score</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-500/30">
                    AI ENGINE v2.6
                  </span>
                </div>

                {/* Preset Selector Tabs */}
                <div className="grid grid-cols-4 gap-1.5 my-4 bg-slate-950/60 p-1 rounded-xl border border-white/5">
                  {simulatorPresets.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePresetIndex(idx)
                        setSelectedSimSkills(p.recommendedSkills.slice(0, 3))
                      }}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer truncate ${
                        activePresetIndex === idx
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p.stream.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Interactive Target Role & CTC Box */}
                <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/10 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Target Role Match</div>
                      <div className="text-sm font-bold text-white leading-tight">{currentPreset.targetRole}</div>
                      <div className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                        <Building2 className="w-3 h-3" />
                        <span>{currentPreset.company}</span>
                      </div>
                    </div>

                    {/* Animated Circular Progress Gauge */}
                    <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="currentColor"
                          strokeWidth="6"
                          className="text-slate-800"
                          fill="transparent"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="currentColor"
                          strokeWidth="6"
                          className="text-emerald-400 transition-all duration-700 ease-out"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 - (dynamicMatchScore / 100) * (2 * Math.PI * 32)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-black text-white font-display leading-none">
                          {dynamicMatchScore}%
                        </span>
                        <span className="text-[9px] text-emerald-400 uppercase font-bold tracking-tight mt-0.5">
                          Match
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Placement CTC Band:</span>
                    <span className="font-bold text-amber-300 font-mono">{currentPreset.baseSalary}</span>
                  </div>
                </div>

                {/* Clickable Skill Toggles */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-2">
                    <span>Select Competencies (Click to toggle):</span>
                    <span className="text-emerald-400">{selectedSimSkills.length} Selected</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPreset.recommendedSkills.map((skill) => {
                      const isSelected = selectedSimSkills.includes(skill)
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSimSkill(skill)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50 shadow-sm'
                              : 'bg-slate-800/60 text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                              isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {isSelected ? '✓' : '+'}
                          </span>
                          <span>{skill}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Dynamic Recommendation Insight */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-200 mb-4">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <div className="font-bold text-amber-300">Skill Gap Recommendation:</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">{currentPreset.gapWarning}</div>
                    <div className="text-[10px] text-emerald-400 font-bold mt-1">
                      ⚡ Bridging this grants {currentPreset.potentialBoost}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <Link
                  to="/register?role=STUDENT"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all group"
                >
                  <span>Verify Your Full Profile with 20-Question Diagnostic</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Platform Collaboration Activity Marquee Ticker ─────── */}
      <section className="bg-slate-900 border-y border-white/10 py-3 overflow-hidden relative shadow-inner">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex-shrink-0 z-10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
              Live National Feed
            </span>
          </div>

          <div className="overflow-hidden relative w-full mask-gradient">
            <div className="animate-marquee flex items-center gap-8 text-xs text-slate-300 whitespace-nowrap">
              {tickerFeed.concat(tickerFeed).map((item, idx) => (
                <div key={idx} className="inline-flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.color === 'emerald'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.color === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.color === 'cyan'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : item.color === 'purple'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {item.tag}
                  </span>
                  <span className="text-slate-200 font-medium">{item.text}</span>
                  <span className="text-slate-600">·</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── KPI Stats Strip ─────────────────────────────────────────── */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: '46+', label: 'Ayush Skills', desc: 'Standardized taxonomy across 6 classical streams', icon: Award, color: 'text-amber-400' },
            { value: '100%', label: 'College Verified', desc: 'Every credential signed off by institution', icon: ShieldCheck, color: 'text-emerald-400' },
            { value: 'Smart AI', label: 'Skill Matcher', desc: 'Precision compatibility scoring for placements', icon: Sparkles, color: 'text-cyan-400' },
            { value: '₹2.5 Cr+', label: 'R&D Grants', desc: 'Sponsored research & corporate sabbaticals', icon: FlaskConical, color: 'text-purple-400' },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.label}
                className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/10 flex items-center gap-4 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                  <Icon className={`w-6 h-6 ${s.color} group-hover:text-white transition-colors`} />
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

      {/* ── Interactive 4-Stakeholder Live Playground ───────────────── */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-3">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Complete Collaboration Architecture</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              One Unified Ecosystem. Four Empowered Pillars.
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore how Yuktha creates synchronized value for students, research academicians, pharmaceutical enterprises, and university deans.
            </p>

            {/* Persona Switcher Tabs */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 max-w-3xl mx-auto">
              {personas.map((p) => {
                const Icon = p.icon
                const isActive = activePersonaTab === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePersonaTab(p.id)}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-950/60 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{p.title.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Persona Split-Screen Showcase */}
          <div className="bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/15 p-6 sm:p-8 lg:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Persona Capabilities */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{currentPersona.roleTag}</span>
                  </div>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    {currentPersona.headline}
                  </h3>
                </div>

                <div className="space-y-3">
                  {currentPersona.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 leading-relaxed">{cap}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to={currentPersona.demoLogin}
                    className="btn-accent px-5 py-3 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                    <span>Instant 1-Click Test-Drive as {currentPersona.title.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </div>

              {/* Right Realistic Persona Simulated Mini-Dashboard */}
              <div className="lg:col-span-6">
                <div className="bg-slate-950 rounded-2xl border border-white/15 p-5 shadow-2xl">
                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 font-mono text-[10px] text-slate-500">yuktha://console/{currentPersona.id}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      LIVE PREVIEW
                    </span>
                  </div>

                  {/* Student Persona Mini Dashboard */}
                  {currentPersona.id === 'student' && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-sm">
                            PS
                          </div>
                          <div>
                            <div className="font-bold text-white">{currentPersona.previewData.name}</div>
                            <div className="text-[11px] text-slate-400">{currentPersona.previewData.batch}</div>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          {currentPersona.previewData.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 text-center">
                          <div className="text-slate-400 text-[10px]">Technical Score</div>
                          <div className="text-base font-bold text-emerald-400 font-display mt-0.5">{currentPersona.previewData.technicalScore}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 text-center">
                          <div className="text-slate-400 text-[10px]">Soft Skills</div>
                          <div className="text-base font-bold text-cyan-400 font-display mt-0.5">{currentPersona.previewData.softSkillScore}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 text-center">
                          <div className="text-slate-400 text-[10px]">Placement Tier</div>
                          <div className="text-base font-bold text-amber-400 font-display mt-0.5">{currentPersona.previewData.clinicalReadiness}</div>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-emerald-400">Top Compatible Placement</div>
                          <div className="text-xs font-bold text-white mt-0.5">{currentPersona.previewData.topMatch}</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm">
                          94% Match
                        </span>
                      </div>

                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between text-[11px] text-amber-300">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Identified Gap: {currentPersona.previewData.missingSkill}</span>
                        </span>
                        <span className="font-bold underline cursor-pointer">Bridge Gap →</span>
                      </div>
                    </div>
                  )}

                  {/* Faculty Persona Mini Dashboard */}
                  {currentPersona.id === 'faculty' && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center text-white font-bold text-sm">
                            RV
                          </div>
                          <div>
                            <div className="font-bold text-white">{currentPersona.previewData.name}</div>
                            <div className="text-[11px] text-slate-400">{currentPersona.previewData.batch}</div>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                          {currentPersona.previewData.status}
                        </span>
                      </div>

                      <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                        <div className="text-[10px] font-bold uppercase text-cyan-400">Collaborative Industry Grant</div>
                        <div className="text-sm font-bold text-white mt-0.5">{currentPersona.previewData.activeGrant}</div>
                        <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Status: {currentPersona.previewData.grantStatus}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400">Corporate Sabbatical Opportunity</div>
                          <div className="text-xs font-bold text-white mt-0.5">{currentPersona.previewData.sabbaticalOpening}</div>
                        </div>
                        <span className="px-2 py-1 rounded bg-white/10 text-white text-[10px] font-bold">Apply Now</span>
                      </div>

                      <div className="p-2.5 bg-slate-900 border border-white/5 rounded-lg flex items-center justify-between text-[11px] text-slate-300">
                        <span>Faculty CEP Credits: {currentPersona.previewData.fdpCredits}</span>
                        <span className="text-emerald-400 font-bold">96% Completed</span>
                      </div>
                    </div>
                  )}

                  {/* Industry Persona Mini Dashboard */}
                  {currentPersona.id === 'company' && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-bold text-sm">
                            HW
                          </div>
                          <div>
                            <div className="font-bold text-white">{currentPersona.previewData.name}</div>
                            <div className="text-[11px] text-slate-400">{currentPersona.previewData.batch}</div>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                          {currentPersona.previewData.status}
                        </span>
                      </div>

                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-blue-400">Candidate Pipeline Search</div>
                          <div className="text-xs font-bold text-white mt-0.5">{currentPersona.previewData.matchFilter}</div>
                          <div className="text-[11px] text-slate-300 mt-1">{currentPersona.previewData.pipelineCount}</div>
                        </div>
                        <span className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-sm">
                          Filter Active
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400">Top Candidate Profile</div>
                          <div className="text-xs font-bold text-white mt-0.5">{currentPersona.previewData.topCandidate}</div>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          Shortlist
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-900 border border-white/5 rounded-lg flex items-center justify-between text-[11px] text-slate-300">
                        <span>Live Postings: {currentPersona.previewData.activePostings}</span>
                        <span className="text-blue-400 font-bold underline cursor-pointer">+ Post RFP</span>
                      </div>
                    </div>
                  )}

                  {/* College Persona Mini Dashboard */}
                  {currentPersona.id === 'college' && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-800 flex items-center justify-center text-white font-bold text-sm">
                            GA
                          </div>
                          <div>
                            <div className="font-bold text-white">{currentPersona.previewData.name}</div>
                            <div className="text-[11px] text-slate-400">{currentPersona.previewData.batch}</div>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                          {currentPersona.previewData.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                          <div className="text-[10px] font-bold uppercase text-purple-400">Cohort Placement Index</div>
                          <div className="text-lg font-black text-white font-display mt-0.5">{currentPersona.previewData.readinessIndex}</div>
                          <div className="text-[10px] text-slate-400">{currentPersona.previewData.cohortSize}</div>
                        </div>
                        <div className="p-3 bg-slate-900 border border-white/10 rounded-xl">
                          <div className="text-[10px] font-bold uppercase text-slate-400">Verification Queue</div>
                          <div className="text-lg font-black text-amber-400 font-display mt-0.5">{currentPersona.previewData.verificationQueue}</div>
                          <div className="text-[10px] text-slate-400">Pending Dean e-Sign</div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400">Curriculum Gap Alert (NAAC)</div>
                          <div className="text-xs font-bold text-amber-300 mt-0.5">{currentPersona.previewData.topCurriculumGap}</div>
                        </div>
                        <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          Fix Gap
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Competency Radar Diagnostic Sandbox ─────────── */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-950 via-[#062016] to-slate-950 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Radar Explanation */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Core Innovation · SIH26044</span>
              </div>

              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                Objective Skill Gap Diagnosis vs. 75% Industry Benchmark
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Generic portals rely on self-declared resume claims. Yuktha computes multi-dimensional
                competency radar vectors against vetted pharmaceutical requirements, instantly highlighting
                exact missing capabilities.
              </p>

              {/* Radar Preset Selector */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Evaluation Role Profile:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'student', label: 'BAMS Graduate', desc: 'Clinical Practitioner' },
                    { key: 'researcher', label: 'CRA Candidate', desc: 'Clinical Trials / GCP' },
                    { key: 'formulation', label: 'Phyto-Chemist', desc: 'HPLC / Extraction QC' },
                  ].map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => setActiveRadarPreset(preset.key)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        activeRadarPreset === preset.key
                          ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{preset.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Gap Scorecard */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-900 rounded-xl border border-white/10">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Peak Competency</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {activeRadarPreset === 'student' ? 'Classical Therapeutics (92%)' : activeRadarPreset === 'researcher' ? 'Clinical Trials & GCP (95%)' : 'Lab & HPLC QC (96%)'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Surpasses 75% benchmark by 17%+</div>
                </div>

                <div className="p-3.5 bg-slate-900 rounded-xl border border-white/10">
                  <div className="text-[10px] uppercase font-bold text-amber-400">Critical Skill Gap</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {activeRadarPreset === 'student' ? 'Regulatory & PSUR (64%)' : activeRadarPreset === 'researcher' ? 'Soft Skills & Patient (76%)' : 'Digital Health & EHR (65%)'}
                  </div>
                  <div className="text-[10px] text-amber-300/80 mt-1">Identified for bridging course</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/register?role=STUDENT"
                  className="btn-accent px-6 py-3.5 text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-xl shadow-amber-500/20"
                >
                  <span>Evaluate Your Own Competencies</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Live Recharts Radar Chart */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900/90 rounded-3xl p-6 border border-white/15 shadow-2xl relative">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div>
                    <div className="text-xs font-bold text-white">Live Competency Radar Plot</div>
                    <div className="text-[10px] text-slate-400">Comparative vector analysis vs. Industry 75%</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    6 EVALUATION AXES
                  </span>
                </div>

                <div className="h-[360px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarPresets[activeRadarPreset]}>
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

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    <span>Candidate Vector</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span>75% Industry Baseline</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ayush Skill Taxonomy Showcase ───────────────────────────── */}
      <section className="py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>National Standardized Repository</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              46+ Standardized Competency Taxonomy
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Standard job portals treat Ayush as generic healthcare. Yuktha introduces a comprehensive
              skill ontology spanning classical systems, modern clinical research protocols, and data-driven pharmacology.
            </p>

            {/* Filter Pills & Search Input */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search skills (e.g. Panchkarma, GCP, HPLC)..."
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
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/40'
                        : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {sys}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Tag Cloud */}
          <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
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
                  className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-emerald-500/40 transition-all"
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

      {/* ── 4-Stage Collaboration Loop ──────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              How the Collaboration Loop Works
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              From initial diagnostic assessment to verifiable credentials in 4 transparent stages
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

      {/* ── Turnkey 1-Click Persona Test-Drive Strip ────────────────── */}
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
            Yuktha is fully pre-seeded with realistic data across students, research professors,
            pharmaceutical enterprises, and colleges. Test any role instantly without setup.
          </p>

          {/* Direct Persona Launch Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
            {[
              { role: 'Student', name: 'Dr. Priya Sharma', icon: '🎓', path: '/login?demo=student', color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10' },
              { role: 'Faculty', name: 'Dr. Rajeshwari V.', icon: '🔬', path: '/login?demo=faculty', color: 'hover:border-cyan-500/50 hover:bg-cyan-500/10' },
              { role: 'Industry', name: 'Himalaya R&D', icon: '🏢', path: '/login?demo=company', color: 'hover:border-blue-500/50 hover:bg-blue-500/10' },
              { role: 'College', name: 'Gujarat Ayurved', icon: '🏛️', path: '/login?demo=college', color: 'hover:border-purple-500/50 hover:bg-purple-500/10' },
              { role: 'Admin', name: 'National Admin', icon: '🇮🇳', path: '/login?demo=admin', color: 'hover:border-amber-500/50 hover:bg-amber-500/10' },
            ].map((d) => (
              <Link
                key={d.role}
                to={d.path}
                className={`p-4 rounded-2xl bg-slate-900/90 border border-white/10 transition-all text-left flex flex-col justify-between ${d.color} group`}
              >
                <div className="text-2xl mb-2">{d.icon}</div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {d.role}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{d.name}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                    <span>1-Click Enter</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
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
              className="btn-ghost-white px-5 py-3 text-xs font-semibold rounded-xl border border-white/15"
            >
              Manual Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-white/10 py-10 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-display font-extrabold text-white text-base tracking-tight">Yuktha</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">Unified Academia–Industry Ayush Portal</span>
            </div>
            <div className="flex flex-wrap gap-4 text-slate-400 text-[11px]">
              <Link to="/register?role=STUDENT" className="hover:text-white">Students</Link>
              <Link to="/register?role=FACULTY" className="hover:text-white">Academicians</Link>
              <Link to="/register?role=COMPANY" className="hover:text-white">Enterprises</Link>
              <Link to="/register?role=COLLEGE" className="hover:text-white">Institutions</Link>
              <Link to="/login" className="hover:text-white">Demo Logins</Link>
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
