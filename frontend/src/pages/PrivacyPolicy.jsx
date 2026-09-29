import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  Eye,
  Server,
  Mail,
  ArrowLeft,
  Calendar,
  CheckCircle2,
} from 'lucide-react'

export default function PrivacyPolicy() {
  const lastUpdated = 'September 29, 2026'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 sm:p-10 mb-10 shadow-xl shadow-black/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Data Protection & Privacy Notice</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-3">
            Yuktha Platform Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Effective Date: {lastUpdated}
            </span>
            <span>·</span>
            <span className="text-slate-300">Governed by the Digital Personal Data Protection (DPDP) Act, 2023</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                01
              </span>
              <h2>Introduction & Scope</h2>
            </div>
            <p>
              Welcome to <strong>Yuktha</strong> (“Platform”), an Academia–Industry Collaboration & Skill Intelligence
              Portal developed for the Ministry of Ayush, Government of India (Smart India Hackathon SIH26044).
              This Privacy Policy explains how we collect, process, store, and safeguard personal and institutional data
              entrusted to us by students, faculty academicians, healthcare companies, and educational institutions.
            </p>
            <p>
              By accessing or registering on the platform, you acknowledge and consent to the data practices
              described in this policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                02
              </span>
              <h2>Information We Collect</h2>
            </div>
            <p>We collect only the data necessary to provide skill evaluation, immersion opportunities, and credential verification:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <li className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white block">Identity & Academic Data</span>
                Full name, verified email address, phone number, enrolled degree (BAMS, BHMS, BUMS, etc.), and university roll number.
              </li>
              <li className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white block">Skill & Assessment Metrics</span>
                Diagnostic test responses, baseline scores, radar chart competencies, and completed clinical modules.
              </li>
              <li className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white block">Portfolio & Achievement Artifacts</span>
                Project submissions, research publications, mentor evaluations, verified certificates, and internship logs.
              </li>
              <li className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-white block">Enterprise & Institutional Data</span>
                Corporate registration details, GST/CIN (for companies), faculty designations, and institutional accreditation statuses.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                03
              </span>
              <h2>How We Use Your Data</h2>
            </div>
            <p>Your information is processed strictly for legitimate educational, research, and placement objectives:</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Facilitating automated skill-gap analysis against national industry benchmarks (75% readiness baseline).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Enabling verified institutions to approve student enrollments and endorse digital portfolios.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Matching academicians with corporate sabbaticals, joint R&D projects, and industry consultancy proposals.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Generating anonymized national skill intelligence reports for policy formulation by the Ministry of Ayush.</span>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                04
              </span>
              <h2>Data Security & Cryptographic Safeguards</h2>
            </div>
            <p>
              We implement industry-grade technical and organizational measures to safeguard all platform records:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl">
                <Lock className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="font-bold text-white">TLS 1.3 / HTTPS</div>
                <div className="text-slate-400 mt-1">End-to-end transport layer encryption for all communications.</div>
              </div>
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl">
                <Server className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="font-bold text-white">Bcrypt Hash</div>
                <div className="text-slate-400 mt-1">Passwords cryptographically salted with zero plaintext exposure.</div>
              </div>
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl">
                <UserCheck className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="font-bold text-white">Role-Based Access</div>
                <div className="text-slate-400 mt-1">Strict isolation between Student, Faculty, Company, and College tiers.</div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                05
              </span>
              <h2>User Rights & Privacy Controls</h2>
            </div>
            <p>
              Under India's Digital Personal Data Protection (DPDP) Act 2023, you retain sovereign rights over your information:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 ml-2">
              <li><strong>Right to Access:</strong> View all profile information, skill ratings, and submitted proposals anytime.</li>
              <li><strong>Right to Rectification:</strong> Update inaccurate academic qualifications or contact information.</li>
              <li><strong>Right to Erasure:</strong> Request permanent removal of your account and associated media files upon graduation.</li>
              <li><strong>Public Portfolio Visibility:</strong> Students control whether their digital portfolio URL is publicly indexable.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                06
              </span>
              <h2>Grievance Redressal Officer</h2>
            </div>
            <p>
              In compliance with national digital privacy guidelines, if you have any inquiries, objections, or concerns
              regarding the processing of your data, you may reach our designated Grievance Officer:
            </p>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-xs space-y-1.5 mt-2">
              <div className="font-bold text-white">Nodal Privacy & Grievance Cell</div>
              <div className="text-slate-300">Yuktha Portal · Ministry of Ayush Collaboration Project (SIH26044)</div>
              <div className="text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-mono">privacy@yuktha.gov.in</span>
              </div>
              <div className="text-slate-400 text-[11px] pt-1">Response turnaround: Within 48 business hours.</div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
