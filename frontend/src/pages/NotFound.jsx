import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Compass,
  ArrowLeft,
  Home,
  Briefcase,
  Sparkles,
  LogIn,
  Search,
} from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
        {/* Glowing backdrop ambient circles */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full text-center relative z-10 space-y-8">
          {/* 404 Visual Display */}
          <div className="relative inline-block">
            <div className="text-8xl sm:text-9xl font-display font-black tracking-tighter bg-gradient-to-br from-white via-slate-200 to-slate-600 bg-clip-text text-transparent select-none">
              404
            </div>
            <div className="absolute -top-3 -right-3 sm:-right-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/50 animate-bounce">
              <Compass className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Page Not Found
            </h1>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              We couldn't locate the requested resource, portfolio, or portal endpoint.
              It might have been archived, renamed, or temporarily unavailable.
            </p>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              to="/"
              className="btn-primary py-3 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Home className="w-4 h-4" />
              <span>Back to Portal Home</span>
            </Link>

            <Link
              to="/#skills"
              className="btn-ghost-white py-3 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-white/10 hover:border-emerald-500/30"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Explore Skills Taxonomy</span>
            </Link>

            <Link
              to="/login"
              className="btn-ghost-white py-3 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-white/10 hover:border-white/20"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Sign In to Account</span>
            </Link>

            <Link
              to="/register"
              className="btn-accent py-3 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <span>Create New Account</span>
            </Link>
          </div>

          {/* Institutional note */}
          <div className="text-[11px] text-slate-400 pt-4">
            Need urgent help? Contact our technical helpdesk at{' '}
            <span className="text-emerald-400 font-mono">support@yuktha.gov.in</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
