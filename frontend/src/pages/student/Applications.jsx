import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { StatusBadge, SkillTag, JobTypeBadge } from '../../components/Badges'
import { CardSkeleton, EmptyState } from '../../components/Skeletons'
import { Link } from 'react-router-dom'
import api from '../../api/client'

export default function StudentApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api.get('/student/applications')
      .then(r => setApplications(r.data))
      .finally(() => setLoading(false))
  }, [])

  const statuses = ['ALL', 'APPLIED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED']
  const filtered = filter === 'ALL' ? applications : applications.filter(a => a.status === filter)

  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === 'ALL' ? applications.length : applications.filter(a => a.status === s).length
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="section-title">My Applications</h1>
          <p className="section-subtitle">Track your job applications from Applied to Accepted</p>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === s
                  ? 'bg-ayush-primary text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-ayush-primary/50'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()} ({counts[s]})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">{Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div>
            <EmptyState
              icon="📋"
              title={filter === 'ALL' ? 'No applications yet' : `No ${filter.toLowerCase()} applications`}
              description="Browse available jobs and apply to track them here"
            />
            <div className="flex justify-center mt-4">
              <Link to="/student/jobs" className="btn-primary">Browse Jobs →</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <div key={app.id} className="card flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-ayush-dark">{app.job.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{app.job.company.name}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>📍 {app.job.location}</span>
                        {app.job.stipend && <span>💰 {app.job.stipend}</span>}
                        <span>Applied {new Date(app.appliedAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={app.status} />
                      <JobTypeBadge type={app.job.type} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {app.job.skills.slice(0, 5).map(({ skill }) => (
                      <SkillTag key={skill.id} name={skill.name} system={skill.system} />
                    ))}
                  </div>
                  {app.note && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
                      💬 Recruiter note: {app.note}
                    </div>
                  )}
                </div>

                {/* Status timeline indicator */}
                <div className="sm:w-40 flex sm:flex-col items-center sm:justify-center gap-2 text-xs">
                  {['APPLIED', 'SHORTLISTED', 'ACCEPTED'].map((s, i) => {
                    const statuses = ['APPLIED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED']
                    const currentIdx = statuses.indexOf(app.status)
                    const thisIdx = statuses.indexOf(s)
                    const isActive = thisIdx <= currentIdx && app.status !== 'REJECTED'
                    return (
                      <div key={s} className="flex items-center gap-1.5 sm:flex-row">
                        <div className={`w-3 h-3 rounded-full border-2 ${isActive ? 'bg-ayush-primary border-ayush-primary' : 'bg-white border-slate-300'}`} />
                        <span className={isActive ? 'text-ayush-primary font-medium' : 'text-slate-400'}>{s.charAt(0) + s.slice(1).toLowerCase()}</span>
                      </div>
                    )
                  })}
                  {app.status === 'REJECTED' && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400 border-2 border-red-400" />
                      <span className="text-red-500 font-medium">Rejected</span>
                    </div>
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
