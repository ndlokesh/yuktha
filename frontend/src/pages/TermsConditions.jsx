import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  FileCheck,
  Scale,
  Building2,
  GraduationCap,
  Landmark,
  ShieldAlert,
  ArrowLeft,
  Calendar,
  CheckCircle2,
} from 'lucide-react'

export default function TermsConditions() {
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
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-10 mb-10 shadow-xl shadow-black/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Legally Binding Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-3">
            Terms & Conditions of Use
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Last Revised: {lastUpdated}
            </span>
            <span>·</span>
            <span className="text-slate-300">National Academia–Industry Collaboration Platform (SIH26044)</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                01
              </span>
              <h2>Acceptance of Terms</h2>
            </div>
            <p>
              By accessing, browsing, or registering on <strong>Yuktha</strong> (“Platform”), you agree to comply with and be bound
              by these Terms and Conditions. These terms govern all participants across the Ayush education and enterprise
              ecosystem, including Students, Faculty Members, Industry Partners, and Affiliated Academic Institutions.
            </p>
            <p>
              If you do not accept these terms in their entirety, you must immediately discontinue using the Platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                02
              </span>
              <h2>Stakeholder Responsibilities & Roles</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <GraduationCap className="w-4 h-4" />
                  <span>Students & Scholars</span>
                </div>
                <p className="text-slate-400">
                  Must provide authentic academic degrees, current college affiliation, and genuine portfolio artifacts.
                  Misrepresentation of credentials or fraudulent assessment submissions results in account termination.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Scale className="w-4 h-4" />
                  <span>Academicians & Faculty</span>
                </div>
                <p className="text-slate-400">
                  May submit R&D proposals, apply for industrial sabbaticals, and provide expert consultancy. Must adhere
                  to ethical guidelines regarding publication data and proprietary corporate research disclosures.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <Building2 className="w-4 h-4" />
                  <span>Enterprises & Pharma R&D</span>
                </div>
                <p className="text-slate-400">
                  Must post legitimate internships, learning programs, and research grants with clear stipends,
                  schedules, and mentors. Zero-tolerance policy for unpaid or misleading predatory job postings.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <Landmark className="w-4 h-4" />
                  <span>Colleges & Universities</span>
                </div>
                <p className="text-slate-400">
                  Responsible for verifying enrolled student identities and sanctioning faculty sabbatical leave
                  requests according to Ministry of Ayush institutional norms.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                03
              </span>
              <h2>Intellectual Property (IP) Rights</h2>
            </div>
            <p>
              Yuktha champions fair IP distribution across academia and industry:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 ml-2">
              <li><strong>Student Work:</strong> Students retain full ownership of their personal portfolio code, diagnostic reflections, and original project repositories.</li>
              <li><strong>Joint Research RFPs:</strong> Collaborative research initiatives funded by enterprise grants must execute explicit bilateral IP agreements prior to project commencement.</li>
              <li><strong>Platform Proprietary Rights:</strong> The Yuktha UI, skill taxonomy algorithm, benchmarking radar methodology, and platform branding are protected under Indian copyright and IP laws.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                04
              </span>
              <h2>Prohibited Platform Conduct</h2>
            </div>
            <p>Users shall not engage in any of the following activities on Yuktha:</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Employing automated bots, spiders, or scrapers to extract candidate portfolios or corporate RFP data.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Circumventing platform authentication, rate limiters, or attempting unauthorized privilege escalation.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Posting spam, commercial advertisements outside approved Ayush R&D postings, or fraudulent job listings.</span>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                05
              </span>
              <h2>Governing Law & Jurisdiction</h2>
            </div>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India.
              Any disputes arising from or relating to the use of Yuktha shall be subject to the exclusive jurisdiction
              of the competent courts located in New Delhi, India.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
