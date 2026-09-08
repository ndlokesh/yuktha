import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  Handshake,
  Building2,
  Calendar,
  Clock,
  Banknote,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  FileText,
  MapPin,
  Sparkles,
} from 'lucide-react'

export default function FacultyOpportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModalOpp, setActiveModalOpp] = useState(null)
  const [proposalForm, setProposalForm] = useState({
    proposal: '',
    documentUrl: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchOpportunities()
  }, [selectedType, searchQuery])

  const fetchOpportunities = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedType) params.type = selectedType
      if (searchQuery) params.search = searchQuery

      const { data } = await api.get('/collaboration/opportunities', { params })
      setOpportunities(data)
    } catch (err) {
      console.error('Fetch opportunities error:', err)
      toast.error('Failed to load opportunities')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitProposal = async (e) => {
    e.preventDefault()
    if (!activeModalOpp) return
    setSubmitting(true)
    try {
      await api.post(`/collaboration/opportunities/${activeModalOpp.id}/apply`, proposalForm)
      toast.success('Collaboration proposal submitted successfully!')
      setActiveModalOpp(null)
      setProposalForm({ proposal: '', documentUrl: '' })
      fetchOpportunities()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit proposal')
    } finally {
      setSubmitting(false)
    }
  }

  const types = [
    { value: '', label: 'All Collaboration Types' },
    { value: 'FACULTY_INTERNSHIP', label: 'Faculty Internships' },
    { value: 'RESEARCH_PROJECT', label: 'Joint Research Grants' },
    { value: 'FDP', label: 'Faculty Dev Programs' },
    { value: 'CONSULTANCY', label: 'Consultancy & Advisory' },
    { value: 'INNOVATION_CHALLENGE', label: 'Innovation Challenges' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
              <Handshake className="w-3.5 h-3.5" />
              <span>Academician–Industry Engagement Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Faculty Internships, FDPs & Research Collaborations
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Gain practical industry exposure through sponsored faculty internships, lead joint research projects,
              participate in Faculty Development Programs (FDPs), and deliver expert industry consultancy.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="opp-search"
              name="opp-search"
              type="text"
              placeholder="Search by research topic, domain, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              id="opp-type-filter"
              name="opp-type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 focus:border-cyan-500 outline-none"
            >
              {types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Catalog */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-slate-400">Loading industry opportunities...</div>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-white/10 rounded-2xl text-slate-400 text-xs">
            No collaboration opportunities found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-slate-900 border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {opp.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {opp.duration}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{opp.title}</h3>
                  <div className="text-xs text-cyan-400 font-medium flex items-center gap-1.5 mb-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{opp.postedBy}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{opp.description}</p>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-200">Domain:</span> {opp.domain}
                    </div>
                    {opp.budgetOrStipend && (
                      <div className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5" />
                        <span>Support: {opp.budgetOrStipend}</span>
                      </div>
                    )}
                    <div className="text-slate-400">
                      <span className="font-semibold text-slate-200">Requirements:</span> {opp.requirements}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Deadline: {new Date(opp.deadline).toLocaleDateString('en-IN')}</span>
                  </div>

                  {opp.hasApplied ? (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied ({opp.applicationStatus})</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveModalOpp(opp)
                        setProposalForm({ proposal: '', documentUrl: '' })
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/40 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Submit Proposal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Proposal Modal */}
        {activeModalOpp && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Submit Proposal / Application
                  </span>
                  <h3 className="text-base font-bold text-white">{activeModalOpp.title}</h3>
                </div>
                <button
                  onClick={() => setActiveModalOpp(null)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitProposal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Proposal / Letter of Intent *
                  </label>
                  <textarea
                    id="opp-proposal"
                    name="opp-proposal"
                    required
                    rows={4}
                    placeholder="Outline your research focus, relevant publications, lab infrastructure readiness, and proposed outcomes..."
                    value={proposalForm.proposal}
                    onChange={(e) => setProposalForm({ ...proposalForm, proposal: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label htmlFor="opp-document-url" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Supporting Document / Full Project PDF URL (Optional)
                  </label>
                  <input
                    id="opp-document-url"
                    name="opp-document-url"
                    type="url"
                    placeholder="https://drive.google.com/... or cloud document link"
                    value={proposalForm.documentUrl}
                    onChange={(e) => setProposalForm({ ...proposalForm, documentUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 leading-relaxed">
                  Your verified academic credentials, department affiliation, and research publications will be automatically attached to this submission.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalOpp(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/40 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
