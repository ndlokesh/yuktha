import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { StatusBadge, SkillTag, MatchScore } from '../../components/Badges'
import { TableRowSkeleton, EmptyState } from '../../components/Skeletons'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  Users,
  Search,
  Building2,
  MapPin,
  GraduationCap,
  FileText,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  BookmarkCheck,
  Filter,
  X,
  Layers,
} from 'lucide-react'

const STATUS_CONFIG = {
  APPLIED: {
    label: 'Applied',
    icon: Clock,
    btnClass: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200',
  },
  SHORTLISTED: {
    label: 'Shortlist',
    icon: BookmarkCheck,
    btnClass: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200',
  },
  ACCEPTED: {
    label: 'Accept Offer',
    icon: CheckCircle2,
    btnClass: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
  },
  REJECTED: {
    label: 'Reject',
    icon: XCircle,
    btnClass: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200',
  },
}

export default function Applicants() {
  const { jobId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})
  const [filters, setFilters] = useState({ skill: '', institution: '', city: '' })

  const fetchData = () => {
    const params = new URLSearchParams(filters).toString()
    api
      .get(`/company/applicants/${jobId}?${params}`)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [jobId, filters])

  const handleStatusChange = async (appId, newStatus, note = '') => {
    setUpdating((p) => ({ ...p, [appId]: true }))
    try {
      await api.patch(`/applications/${appId}`, { status: newStatus, note })
      toast.success(`Application updated to ${newStatus.toLowerCase()}`)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update application status')
    } finally {
      setUpdating((p) => ({ ...p, [appId]: false }))
    }
  }

  const hasActiveFilters = filters.skill || filters.institution || filters.city
  const clearFilters = () => setFilters({ skill: '', institution: '', city: '' })

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Context */}
        <div className="flex items-center justify-between">
          <Link
            to="/company/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Candidate Review Portal</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                Active Job Listing
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {data?.job?.title || 'Applicant Pool'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  {data?.applications?.length || 0} candidate applications received
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Sorted by Ayush skill match score
                </span>
              </p>
            </div>

            {data?.job && (
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{data.job.location}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {data.job.stipend || 'Competitive'} · {data.job.type}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Job skill requirements preview */}
          {data?.job && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Required Competencies ({data.job.skills?.length || 0})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.job.skills?.map(({ skill }) => (
                  <SkillTag key={skill.id} name={skill.name} system={skill.system} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Candidate Filters
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                placeholder="Filter by Skill (e.g. Panchkarma)..."
                value={filters.skill}
                onChange={(e) => setFilters((f) => ({ ...f, skill: e.target.value }))}
              />
            </div>

            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                placeholder="Institution (e.g. Gujarat Ayurved)..."
                value={filters.institution}
                onChange={(e) => setFilters((f) => ({ ...f, institution: e.target.value }))}
              />
            </div>

            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                placeholder="City (e.g. Jamnagar, Varanasi)..."
                value={filters.city}
                onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Applicants Table / List */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Candidate Profile
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Acquired Ayush Skills
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Role Match
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Current Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Review Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => <TableRowSkeleton key={i} cols={5} />)
                ) : data?.applications?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <EmptyState
                        icon={<Users className="w-8 h-8 text-emerald-600" />}
                        title="No candidates match criteria"
                        description="Adjust your search filters or share this opening with verified colleges to attract applications."
                      />
                    </td>
                  </tr>
                ) : (
                  data?.applications?.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Candidate Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                            {app.student.user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 leading-tight">
                              {app.student.user.name}
                            </div>
                            <div className="text-xs text-slate-600 font-medium mt-0.5">
                              {app.student.degree}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {app.student.institution} · Batch {app.student.graduationYear}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {app.student.city}, {app.student.state}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              {app.student.resumeUrl && (
                                <a
                                  href={app.student.resumeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 transition-colors"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>Verified Resume</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              <Link
                                to={`/portfolio/${app.student.id}`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 transition-colors"
                              >
                                <Sparkles className="w-3 h-3 text-blue-600" />
                                <span>Digital Portfolio</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Skills Column */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {app.student.skills.slice(0, 4).map(({ skill }) => (
                            <SkillTag key={skill.id} name={skill.name} system={skill.system} />
                          ))}
                          {app.student.skills.length > 4 && (
                            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              +{app.student.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Match Column */}
                      <td className="px-6 py-4">
                        <div className="min-w-[130px]">
                          <MatchScore percent={app.matchPercent} />
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {['SHORTLISTED', 'ACCEPTED', 'REJECTED']
                            .filter((s) => s !== app.status)
                            .map((statusKey) => {
                              const config = STATUS_CONFIG[statusKey]
                              const Icon = config.icon
                              const isUpdating = updating[app.id]

                              return (
                                <button
                                  key={statusKey}
                                  disabled={isUpdating}
                                  onClick={() => handleStatusChange(app.id, statusKey)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 ${config.btnClass}`}
                                >
                                  {isUpdating ? (
                                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Icon className="w-3.5 h-3.5" />
                                  )}
                                  <span>{config.label}</span>
                                </button>
                              )
                            })}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
