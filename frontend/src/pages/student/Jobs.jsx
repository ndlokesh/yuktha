import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { SkillTag, JobTypeBadge, MatchScore } from '../../components/Badges'
import { CardSkeleton, EmptyState } from '../../components/Skeletons'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Banknote,
  SearchX,
  SlidersHorizontal,
} from 'lucide-react'

export default function StudentJobs() {
  const [jobs, setJobs] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState({})
  const [applied, setApplied] = useState(new Set())
  const [filters, setFilters] = useState({ search: '', type: '', location: '' })
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/jobs'),
      api.get('/student/profile'),
      api.get('/student/applications'),
    ])
      .then(([jobsRes, profileRes, appsRes]) => {
        setJobs(jobsRes.data)
        setProfile(profileRes.data)
        setApplied(new Set(appsRes.data.map((a) => a.job.id)))
      })
      .finally(() => setLoading(false))
  }, [])

  const computeMatch = (job) => {
    if (!profile?.skills?.length) return 0
    const mySkillIds = new Set(profile.skills.map((s) => s.skillId))
    const required = job.skills.map((s) => s.skillId)
    if (!required.length) return 0
    const matched = required.filter((id) => mySkillIds.has(id)).length
    return Math.round((matched / required.length) * 100)
  }

  const filteredJobs = jobs
    .filter((j) => {
      if (filters.type && j.type !== filters.type) return false
      if (filters.location && !j.location.toLowerCase().includes(filters.location.toLowerCase()))
        return false
      if (
        filters.search &&
        !j.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !j.company.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false
      return true
    })
    .map((j) => ({ ...j, match: computeMatch(j) }))
    .sort((a, b) => b.match - a.match)

  const handleApply = async (jobId) => {
    setApplying((p) => ({ ...p, [jobId]: true }))
    try {
      await api.post(`/apply/${jobId}`)
      setApplied((prev) => new Set([...prev, jobId]))
      toast.success('Application submitted successfully! Track it in your dashboard.')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit application')
    } finally {
      setApplying((p) => ({ ...p, [jobId]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Skill-Matched Opportunities</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Ayush Placement & Internship Board
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Ranked dynamically by your verified Ayush taxonomy competencies
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
            Showing <span className="text-emerald-700 font-bold">{filteredJobs.length}</span> positions
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                className="input pl-10"
                placeholder="Search job title, keywords or company..."
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              />
            </div>

            {/* Type Filter */}
            <div className="sm:col-span-3 relative">
              <select
                className="input"
                value={filters.type}
                onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
              >
                <option value="">All Employment Types</option>
                <option value="INTERNSHIP">Clinical Internship</option>
                <option value="JOB">Full-time Position</option>
              </select>
            </div>

            {/* Location Input */}
            <div className="sm:col-span-3 relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                className="input pl-10"
                placeholder="City or state..."
                value={filters.location}
                onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <CardSkeleton key={i} />
              ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
            <SearchX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No matching positions found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try clearing your search query or location filter to see all Ayush listings.
            </p>
            <button
              onClick={() => setFilters({ search: '', type: '', location: '' })}
              className="btn-secondary mt-4 py-2 px-4 text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredJobs.map((job) => {
              const isApplied = applied.has(job.id)
              const isSelected = selected?.id === job.id

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-slate-900 leading-snug truncate">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{job.company.name}</span>
                        </div>
                      </div>
                      <JobTypeBadge type={job.type} />
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3.5">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </span>
                      {job.stipend && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="font-semibold text-emerald-800 flex items-center gap-1">
                            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{job.stipend}</span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Match Score Badge */}
                    <div className="mb-3.5">
                      <MatchScore percent={job.match} />
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.skills.slice(0, 4).map(({ skill }) => (
                        <SkillTag key={skill.id} name={skill.name} system={skill.system} size="xs" />
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-[11px] font-semibold text-slate-400 self-center">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 mt-auto">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(isSelected ? null : job)}
                        className="btn-secondary btn-sm flex-1 justify-center py-2 text-xs font-semibold cursor-pointer"
                      >
                        <span>{isSelected ? 'Collapse' : 'Details'}</span>
                        {isSelected ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        disabled={isApplied || applying[job.id]}
                        onClick={() => handleApply(job.id)}
                        className={`btn-sm flex-1 justify-center py-2 text-xs font-bold transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'btn-primary'
                        }`}
                      >
                        {applying[job.id] ? (
                          'Submitting...'
                        ) : isApplied ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Applied</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <span>1-Click Apply</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isSelected && (
                      <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-6 -mb-6 p-5 rounded-b-3xl space-y-3 animate-in fade-in">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Full Job Description
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed mt-1">
                            {job.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              Deadline:{' '}
                              {new Date(job.deadline).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </span>
                          <span className="font-semibold text-emerald-800">
                            Recruiter: {job.company.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
