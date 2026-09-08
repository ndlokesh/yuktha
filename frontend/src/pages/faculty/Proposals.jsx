import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/client'
import {
  FileCheck,
  Building2,
  Calendar,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

export default function FacultyProposals() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    setLoading(true)
    try {
      const res = await api.get('/collaboration/faculty/my-proposals')
      setProposals(res.data)
    } catch (err) {
      console.error('Fetch proposals error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Collaboration Proposal Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            My Submitted Proposals & Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time status tracking for faculty internships, research grants, consultancy bids, and FDP registrations.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-xs text-slate-400">Loading submitted proposals...</div>
          </div>
        ) : proposals.length === 0 ? (
          <div className="bg-slate-900 rounded-3xl p-12 text-center border border-white/10 text-slate-400 text-xs">
            You haven't submitted any collaboration proposals yet. Explore open industry opportunities!
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((prop) => (
              <div
                key={prop.id}
                className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl space-y-3 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {prop.type.replace('_', ' ')}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{prop.title}</h3>
                    <div className="text-xs text-emerald-400 font-medium mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{prop.organization}</span>
                      {prop.budgetOrStipend && (
                        <span className="text-slate-400">· Support: {prop.budgetOrStipend}</span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase self-start sm:self-auto ${
                      prop.status === 'ACCEPTED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : prop.status === 'UNDER_REVIEW'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {prop.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 leading-relaxed">
                  <span className="font-semibold text-slate-400">Submitted Proposal: </span>
                  {prop.proposal}
                </div>

                {prop.reviewNote && (
                  <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-2xl text-xs text-cyan-200 flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Reviewer Feedback: </span>
                      <span>{prop.reviewNote}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Submitted on {new Date(prop.appliedAt).toLocaleDateString('en-IN')}</span>
                  </span>

                  {prop.documentUrl && (
                    <a
                      href={prop.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                    >
                      <span>View Attached Document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
