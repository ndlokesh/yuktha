import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/client'
import {
  Handshake,
  BookOpen,
  FileCheck,
  Building2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Calendar,
} from 'lucide-react'

export default function FacultyDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFacultyData()
  }, [])

  const fetchFacultyData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/faculty/dashboard')
      setData(res.data)
    } catch (err) {
      console.error('Faculty dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs text-slate-400">Loading academician dashboard...</div>
        </div>
      </div>
    )
  }

  const { faculty, stats, proposals, enrolledPrograms, recentOpportunities } = data || {}

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-2">
              <Handshake className="w-3.5 h-3.5" />
              <span>Academician & Researcher Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Welcome, {faculty?.designation} {faculty?.user?.name || ''}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {faculty?.department} · {faculty?.institution}
            </p>
            <div className="text-xs text-cyan-400 mt-1 font-medium">
              Specialization: {faculty?.specializations}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/faculty/opportunities"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all"
            >
              <span>Explore Industry RFPs & Internships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Total Proposals</div>
              <div className="text-2xl font-bold text-white mt-1">{stats?.totalProposals || 0}</div>
              <div className="text-[11px] text-cyan-400 mt-1">Submitted research & FDPs</div>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Approved Collaborations</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{stats?.acceptedProposals || 0}</div>
              <div className="text-[11px] text-emerald-400 mt-1">Industry active grants</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Enrolled FDPs</div>
              <div className="text-2xl font-bold text-white mt-1">{stats?.enrolledFDPs || 0}</div>
              <div className="text-[11px] text-amber-400 mt-1">Faculty Dev Programs</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Open Opportunities</div>
              <div className="text-2xl font-bold text-white mt-1">{stats?.openOpportunities || 0}</div>
              <div className="text-[11px] text-blue-400 mt-1">Internships & RFPs</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Two Columns: Recent Proposals & Active Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Proposals (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                  <span>My Collaboration Proposals</span>
                </h2>
                <Link to="/faculty/proposals" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {proposals?.length === 0 ? (
                  <div className="text-xs text-slate-500 py-8 text-center">
                    No proposals submitted yet. Browse open industry opportunities to apply!
                  </div>
                ) : (
                  proposals?.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-bold text-white">{p.opportunity.title}</h3>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Domain: {p.opportunity.domain} · Budget: {p.opportunity.budgetOrStipend}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.status === 'ACCEPTED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : p.status === 'UNDER_REVIEW'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          {p.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 italic">"{p.proposal}"</p>
                      {p.reviewNote && (
                        <div className="text-[11px] text-cyan-300 bg-cyan-950/30 p-2 rounded-lg border border-cyan-500/20">
                          Reviewer note: {p.reviewNote}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <Link
              to="/faculty/opportunities"
              className="mt-4 pt-4 border-t border-white/5 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1.5"
            >
              <span>Submit New Collaboration Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Open Industry Opportunities (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-cyan-400" />
                  <span>Featured Industry Calls for Academicians</span>
                </h2>
                <Link to="/faculty/opportunities" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                  Explore Catalog
                </Link>
              </div>

              <div className="space-y-3">
                {recentOpportunities?.map((opp) => (
                  <div key={opp.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {opp.type.replace('_', ' ')}
                        </span>
                        <h3 className="text-xs font-bold text-white mt-1">{opp.title}</h3>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {opp.company?.name || opp.college?.name} · {opp.budgetOrStipend}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{opp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/faculty/opportunities"
              className="mt-4 pt-4 border-t border-white/5 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1.5"
            >
              <span>View All Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
