import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { StatusBadge, SkillTag, JobTypeBadge } from '../../components/Badges'
import { CardSkeleton, EmptyState } from '../../components/Skeletons'
import { Link } from 'react-router-dom'
import api from '../../api/client'
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
} from 'lucide-react'

export default function StudentApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api
      .get('/student/applications')
      .then((r) => setApplications(r.data))
      .finally(() => setLoading(false))
  }, [])

  const statuses = ['ALL', 'APPLIED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED']
  const filtered =
    filter === 'ALL' ? applications : applications.filter((a) => a.status === filter)

  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === 'ALL' ? applications.length : applications.filter((a) => a.status === s).length
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-1.5">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Application Pipeline</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            My Ayush Job Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time status tracking from submission through shortlisting and acceptance
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 flex-wrap bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                filter === s
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {s === 'ALL' ? 'All Applications' : s.charAt(0) + s.slice(1).toLowerCase()} ({counts[s]})
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <CardSkeleton key={i} />
              ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">
              {filter === 'ALL' ? 'No applications yet' : `No ${filter.toLowerCase()} applications`}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Discover active vacancies aligned with your verified Ayush skills.
            </p>
            <div className="flex justify-center mt-4">
              <Link to="/student/jobs" className="btn-primary py-2 px-4 text-xs font-bold rounded-xl flex items-center gap-2">
                <span>Browse Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-6 justify-between"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">
                        {app.job.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.job.company.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <JobTypeBadge type={app.job.type} />
                      <StatusBadge status={app.status} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.job.location}</span>
                    </span>
                    {app.job.stipend && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-800">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{app.job.stipend}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-400">
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
                    <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-blue-950">
                      <MessageSquare className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Recruiter Message: </span>
                        <span>{app.note}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Stepper Indicator */}
                <div className="md:w-48 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 flex flex-col justify-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Progress Timeline
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
                      const Icon = step.icon

                      return (
                        <div key={step.key} className="flex items-center gap-2.5 text-xs">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                              isComplete
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {isComplete ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                          </div>
                          <span
                            className={`font-semibold ${
                              isCurrent
                                ? 'text-emerald-800 font-bold'
                                : isComplete
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      )
                    })}

                    {app.status === 'REJECTED' && (
                      <div className="flex items-center gap-2.5 text-xs pt-1 border-t border-slate-100">
                        <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                          <AlertCircle className="w-3 h-3" />
                        </div>
                        <span className="font-bold text-rose-600">Application Closed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
