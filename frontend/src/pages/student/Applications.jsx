import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { StatusBadge, SkillTag, JobTypeBadge } from '../../components/Badges'
import { CardSkeleton } from '../../components/Skeletons'
import { Link } from 'react-router-dom'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  FileCheck,
  Building2,
  MapPin,
  Banknote,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Briefcase,
  Plus,
  Star,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

export default function StudentApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [expandedMilestones, setExpandedMilestones] = useState({})
  const [activeModalAppId, setActiveModalAppId] = useState(null)
  const [milestoneForm, setMilestoneForm] = useState({
    weekNumber: 1,
    title: '',
    description: '',
    deliverablesUrl: '',
  })

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = () => {
    setLoading(true)
    api
      .get('/student/applications')
      .then((r) => setApplications(r.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  const toggleMilestones = (appId) => {
    setExpandedMilestones((prev) => ({ ...prev, [appId]: !prev[appId] }))
  }

  const handleAddMilestone = async (e) => {
    e.preventDefault()
    if (!activeModalAppId) return
    try {
      await api.post(`/applications/${activeModalAppId}/milestones`, milestoneForm)
      toast.success('Weekly milestone submitted for mentor review!')
      setActiveModalAppId(null)
      setMilestoneForm({ weekNumber: 1, title: '', description: '', deliverablesUrl: '' })
      fetchApplications()
    } catch {
      toast.error('Failed to log milestone')
    }
  }

  const statuses = ['ALL', 'APPLIED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED']
  const filtered =
    filter === 'ALL' ? applications : applications.filter((a) => a.status === filter)

  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === 'ALL' ? applications.length : applications.filter((a) => a.status === s).length
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Application & Internship Lifecycle</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            My Applications & Internship Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track recruitment stages, shortlisting notifications, weekly internship milestones, and mentor evaluations.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 flex-wrap bg-slate-900 p-2 rounded-2xl border border-white/10 shadow-lg">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                filter === s
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {s === 'ALL' ? 'All Applications' : s.charAt(0) + s.slice(1).toLowerCase()} ({counts[s]})
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <CardSkeleton key={i} />
              ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 rounded-3xl p-12 text-center border border-white/10 shadow-xl">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-white text-base">
              {filter === 'ALL' ? 'No applications yet' : `No ${filter.toLowerCase()} applications`}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Discover active vacancies aligned with your verified competencies.
            </p>
            <div className="flex justify-center mt-4">
              <Link to="/student/jobs" className="py-2 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2">
                <span>Browse Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="bg-slate-900 rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col space-y-4 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-white leading-snug">
                          {app.job.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-0.5 font-medium">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{app.job.company.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <JobTypeBadge type={app.job.type} />
                        <StatusBadge status={app.status} />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{app.job.location}</span>
                      </span>
                      {app.job.stipend && (
                        <span className="flex items-center gap-1 font-semibold text-emerald-400">
                          <Banknote className="w-3.5 h-3.5" />
                          <span>{app.job.stipend}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Applied on {new Date(app.appliedAt).toLocaleDateString('en-IN')}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {app.job.skills.slice(0, 5).map(({ skill }) => (
                        <SkillTag key={skill.id} name={skill.name} system={skill.system} size="xs" />
                      ))}
                    </div>

                    {app.note && (
                      <div className="p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-blue-200">
                        <MessageSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Recruiter Review: </span>
                          <span>{app.note}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Stepper Indicator */}
                  <div className="md:w-48 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6 flex flex-col justify-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Application Stages
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { key: 'APPLIED', label: 'Applied', icon: Clock },
                        { key: 'SHORTLISTED', label: 'Shortlisted', icon: Sparkles },
                        { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
                      ].map((step, idx) => {
                        const order = ['APPLIED', 'SHORTLISTED', 'ACCEPTED']
                        const currentIdx = order.indexOf(app.status)
                        const isComplete = currentIdx >= idx && app.status !== 'REJECTED'
                        const isCurrent = app.status === step.key

                        return (
                          <div key={step.key} className="flex items-center gap-2.5 text-xs">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                isComplete
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700'
                              }`}
                            >
                              {isComplete ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                            </div>
                            <span
                              className={`font-semibold ${
                                isCurrent
                                  ? 'text-emerald-400 font-bold'
                                  : isComplete
                                  ? 'text-slate-200'
                                  : 'text-slate-500'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        )
                      })}

                      {app.status === 'REJECTED' && (
                        <div className="flex items-center gap-2.5 text-xs pt-1 border-t border-white/10">
                          <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                            <AlertCircle className="w-3 h-3" />
                          </div>
                          <span className="font-bold text-rose-400">Application Closed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Internship Milestones Section */}
                {(app.status === 'ACCEPTED' || app.status === 'COMPLETED') && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleMilestones(app.id)}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Internship Milestones & Mentor Feedback ({app.milestones?.length || 0})</span>
                        {expandedMilestones[app.id] ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveModalAppId(app.id)
                            setMilestoneForm({
                              weekNumber: (app.milestones?.length || 0) + 1,
                              title: '',
                              description: '',
                              deliverablesUrl: '',
                            })
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Log Weekly Progress</span>
                        </button>

                        <a
                          href="https://certificates.yuktha.gov.in/demo"
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Certificate</span>
                        </a>
                      </div>
                    </div>

                    {expandedMilestones[app.id] && (
                      <div className="mt-4 space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                        {app.milestones?.length === 0 ? (
                          <div className="text-xs text-slate-500 py-2">
                            No milestones logged yet. Submit your first weekly log to get mentor feedback!
                          </div>
                        ) : (
                          app.milestones.map((m) => (
                            <div key={m.id} className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white">
                                  Week {m.weekNumber}: {m.title}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  {m.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>

                              {m.mentorFeedback && (
                                <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-[11px]">Mentor Evaluation:</span>
                                    {m.mentorRating && (
                                      <div className="flex items-center text-amber-400">
                                        <span>{m.mentorRating}</span>
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 ml-0.5" />
                                      </div>
                                    )}
                                  </div>
                                  <div>{m.mentorFeedback}</div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Milestone Submission Modal */}
        {activeModalAppId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Log Weekly Internship Milestone</h3>
              <p className="text-xs text-slate-400">
                Provide an executive summary of your clinical or technical deliverables for mentor evaluation.
              </p>

              <form onSubmit={handleAddMilestone} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="1"
                    max="52"
                    placeholder="Week Number"
                    required
                    value={milestoneForm.weekNumber}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, weekNumber: e.target.value })}
                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Milestone Title *"
                    required
                    value={milestoneForm.title}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none"
                  />
                </div>
                <textarea
                  placeholder="Summary of completed tasks, patient cases, or code commits *"
                  required
                  rows={3}
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none"
                />
                <input
                  type="url"
                  placeholder="Deliverables Link / Document URL (Optional)"
                  value={milestoneForm.deliverablesUrl}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, deliverablesUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalAppId(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Submit Milestone
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
