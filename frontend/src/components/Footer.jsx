import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-300 text-xs relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-600/10 blur-3xl pointer-events-none" />

      {/* Tricolor top border accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Platform Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-700 to-slate-900 p-[1px] shadow-md shadow-emerald-900/40">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <span className="font-display font-black text-xl bg-gradient-to-tr from-amber-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                    Y
                  </span>
                </div>
              </div>
              <div>
                <span className="font-display font-black text-lg tracking-tight text-white">Yuktha</span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                  Academia–Industry Collaboration
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Yuktha is the centralized intelligence and collaboration portal engineered to bridge India's Ayush
              academic talent with healthcare enterprises, research laboratories, and institutional mentors.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                SIH26044 Solution
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                <Award className="w-3.5 h-3.5" />
                Ministry of Ayush
              </span>
            </div>
          </div>

          {/* Col 2: Stakeholder Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Stakeholders</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/register?role=STUDENT" className="hover:text-emerald-400 transition-colors">
                  Ayush Students & Scholars
                </Link>
              </li>
              <li>
                <Link to="/register?role=FACULTY" className="hover:text-cyan-400 transition-colors">
                  Academicians & Faculty
                </Link>
              </li>
              <li>
                <Link to="/register?role=COMPANY" className="hover:text-blue-400 transition-colors">
                  Industry & Pharma R&D
                </Link>
              </li>
              <li>
                <Link to="/register?role=COLLEGE" className="hover:text-purple-400 transition-colors">
                  Institutions & Universities
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors">
                  National Ministry Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Capabilities</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/#skills" className="hover:text-emerald-400 transition-colors">
                  Ayush Skill Taxonomy
                </Link>
              </li>
              <li>
                <Link to="/#radar-benchmark" className="hover:text-emerald-400 transition-colors">
                  Radar Gap Benchmarking
                </Link>
              </li>
              <li>
                <Link to="/#workflow" className="hover:text-emerald-400 transition-colors">
                  Immersion Workflow
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Digital Portfolios & Badges
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Industry Internships & RFPs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Trust & Legal</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  XML Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Robots Directive
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  DPDP Act 2023 Compliant
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {currentYear} Yuktha Platform · Developed for Smart India Hackathon (SIH26044) · Ministry of Ayush, Govt. of India.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/privacy" className="hover:text-slate-200 transition-colors">Privacy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-slate-200 transition-colors">Terms</Link>
            <span>·</span>
            <span className="text-emerald-400 font-medium">SSL 256-Bit Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
