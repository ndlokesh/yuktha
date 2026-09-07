import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { SkillTag, JobTypeBadge, MatchScore } from '../../components/Badges'
import { CardSkeleton, EmptyState } from '../../components/Skeletons'
import api from '../../api/client'
import toast from 'react-hot-toast'

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
    ]).then(([jobsRes, profileRes, appsRes]) => {
      setJobs(jobsRes.data)
      setProfile(profileRes.data)
      setApplied(new Set(appsRes.data.map(a => a.job.id)))
    }).finally(() => setLoading(false))
  }, [])

  const computeMatch = (job) => {
    if (!profile?.skills?.length) return 0
    const mySkillIds = new Set(profile.skills.map(s => s.skillId))
    const required = job.skills.map(s => s.skillId)
    if (!required.length) return 0
    const matched = required.filter(id => mySkillIds.has(id)).length
    return Math.round((matched / required.length) * 100)
  }

  const filteredJobs = jobs
    .filter(j => {
      if (filters.type && j.type !== filters.type) return false
      if (filters.location && !j.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.search && !j.title.toLowerCase().includes(filters.search.toLowerCase()) && !j.company.name.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
    .map(j => ({ ...j, match: computeMatch(j) }))
    .sort((a, b) => b.match - a.match)

  const handleApply = async (jobId) => {
    setApplying(p => ({ ...p, [jobId]: true }))
    try {
      await api.post(`/apply/${jobId}`)
      setApplied(prev => new Set([...prev, jobId]))
      toast.success('Application submitted!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to apply')
    } finally {
      setApplying(p => ({ ...p, [jobId]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="section-title">Browse Opportunities</h1>
          <p className="section-subtitle">Jobs sorted by your Ayush skill-match score</p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Search</label>
              <input className="input" placeholder="Job title or company..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
                <option value="">All types</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="JOB">Full-time Job</option>
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="City or state..." value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState icon="🔍" title="No jobs found" description="Try adjusting your filters or check back soon" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="card-hover flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-ayush-dark leading-tight truncate">{job.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{job.company.name}</p>
                  </div>
                  <JobTypeBadge type={job.type} />
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span>📍 {job.location}</span>
                  {job.stipend && <span>💰 {job.stipend}</span>}
                </div>

                <MatchScore percent={job.match} />

                <div className="flex flex-wrap gap-1.5 my-3">
                  {job.skills.slice(0, 4).map(({ skill }) => (
                    <SkillTag key={skill.id} name={skill.name} system={skill.system} />
                  ))}
                  {job.skills.length > 4 && <span className="text-xs text-slate-400">+{job.skills.length - 4}</span>}
                </div>

                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{job.description}</p>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => setSelected(selected?.id === job.id ? null : job)}
                    className="btn-ghost btn-sm flex-1 justify-center"
                  >
                    {selected?.id === job.id ? 'Hide' : 'View Details'}
                  </button>
                  <button
                    disabled={applied.has(job.id) || applying[job.id]}
                    onClick={() => handleApply(job.id)}
                    className={`btn-sm flex-1 justify-center ${applied.has(job.id) ? 'btn bg-green-100 text-green-700' : 'btn-primary'}`}
                  >
                    {applying[job.id] ? 'Applying...' : applied.has(job.id) ? '✓ Applied' : 'Apply →'}
                  </button>
                </div>

                {/* Expanded detail */}
                {selected?.id === job.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
