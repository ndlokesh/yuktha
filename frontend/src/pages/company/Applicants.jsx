import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { StatusBadge, SkillTag, MatchScore } from '../../components/Badges'
import { TableRowSkeleton, EmptyState } from '../../components/Skeletons'
import api from '../../api/client'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['APPLIED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED']

export default function Applicants() {
  const { jobId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})
  const [filters, setFilters] = useState({ skill: '', institution: '', city: '' })

  const fetchData = () => {
    const params = new URLSearchParams(filters).toString()
    api.get(`/company/applicants/${jobId}?${params}`)
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [jobId, filters])

  const handleStatusChange = async (appId, newStatus, note = '') => {
    setUpdating(p => ({ ...p, [appId]: true }))
    try {
      await api.patch(`/applications/${appId}`, { status: newStatus, note })
      toast.success(`Status updated to ${newStatus}`)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update')
    } finally {
      setUpdating(p => ({ ...p, [appId]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="section-title">{data?.job?.title || 'Applicants'}</h1>
          <p className="section-subtitle">
            {data?.applications?.length || 0} applicants · Sorted by skill-match score
          </p>
        </div>

        {/* Job skill requirements */}
        {data?.job && (
          <div className="card mb-6">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Required Skills for this Role</h3>
            <div className="flex flex-wrap gap-2">
              {data.job.skills.map(({ skill }) => (
                <SkillTag key={skill.id} name={skill.name} system={skill.system} />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Filter by Skill</label>
              <input className="input" placeholder="e.g. Panchkarma" value={filters.skill} onChange={e => setFilters(f => ({ ...f, skill: e.target.value }))} />
            </div>
            <div>
              <label className="label">Institution</label>
              <input className="input" placeholder="e.g. Gujarat Ayurved" value={filters.institution} onChange={e => setFilters(f => ({ ...f, institution: e.target.value }))} />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" placeholder="e.g. Jamnagar" value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Applicants table */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Match</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(4).fill(0).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
                ) : data?.applications?.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState icon="👥" title="No applicants yet" description="Share the job listing to attract candidates" /></td></tr>
                ) : (
                  data?.applications?.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-sm text-ayush-dark">{app.student.user.name}</div>
                          <div className="text-xs text-slate-500">{app.student.degree} · {app.student.institution}</div>
                          <div className="text-xs text-slate-400">{app.student.city} · Batch {app.student.graduationYear}</div>
                          {app.student.resumeUrl && (
                            <a href={app.student.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-ayush-primary hover:underline mt-0.5 inline-block">
                              📄 Resume
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {app.student.skills.slice(0, 4).map(({ skill }) => (
                            <SkillTag key={skill.id} name={skill.name} system={skill.system} />
                          ))}
                          {app.student.skills.length > 4 && (
                            <span className="text-xs text-slate-400">+{app.student.skills.length - 4}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <MatchScore percent={app.matchPercent} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {STATUS_OPTIONS.filter(s => s !== app.status).map(s => (
                            <button
                              key={s}
                              disabled={updating[app.id]}
                              onClick={() => handleStatusChange(app.id, s)}
                              className={`btn-sm text-xs ${
                                s === 'ACCEPTED' ? 'btn bg-green-100 text-green-700 hover:bg-green-200' :
                                s === 'SHORTLISTED' ? 'btn bg-amber-100 text-amber-700 hover:bg-amber-200' :
                                s === 'REJECTED' ? 'btn bg-red-100 text-red-700 hover:bg-red-200' :
                                'btn-ghost'
                              }`}
                            >
                              {updating[app.id] ? '...' : s.charAt(0) + s.slice(1).toLowerCase()}
                            </button>
                          ))}
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
