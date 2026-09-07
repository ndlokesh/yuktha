import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import { JobTypeBadge } from '../../components/Badges'
import { StatSkeleton, CardSkeleton, EmptyState } from '../../components/Skeletons'
import api from '../../api/client'

export default function CompanyDashboard() {
  const { user } = useAuth()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/company/profile'),
      api.get('/jobs/company/mine'),
    ]).then(([cRes, jRes]) => {
      setCompany(cRes.data)
      setJobs(jRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const totalApps = jobs.reduce((s, j) => s + (j._count?.applications || 0), 0)

  const stats = [
    { icon: '📋', label: 'Active Listings', value: jobs.filter(j => j.isActive).length, color: 'bg-ayush-primary' },
    { icon: '👥', label: 'Total Applicants', value: totalApps, color: 'bg-blue-500' },
    { icon: '🎓', label: 'Internships', value: jobs.filter(j => j.type === 'INTERNSHIP').length, color: 'bg-violet-500' },
    { icon: '💼', label: 'Full-time Jobs', value: jobs.filter(j => j.type === 'JOB').length, color: 'bg-sky-500' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="section-title">{company?.name || user?.name}</h1>
            <p className="section-subtitle">{company?.sector} · {company?.city}</p>
          </div>
          <Link to="/company/post-job" className="btn-primary">+ Post New Job</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {loading ? Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />) : stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Job listings */}
        <div>
          <h2 className="font-semibold text-lg text-ayush-dark mb-4">Your Job Listings</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div>
              <EmptyState icon="📋" title="No job listings yet" description="Post your first internship or job opportunity to find Ayush talent" />
              <div className="flex justify-center mt-4">
                <Link to="/company/post-job" className="btn-primary">Post First Job →</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="card-hover">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-sm text-ayush-dark">{job.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{job.location}</p>
                    </div>
                    <JobTypeBadge type={job.type} />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span>👥 {job._count?.applications || 0} applicants</span>
                    <span>📅 Closes {new Date(job.deadline).toLocaleDateString('en-IN')}</span>
                  </div>

                  {!job.isActive && (
                    <span className="badge bg-slate-100 text-slate-500 mb-3">Inactive</span>
                  )}

                  <Link
                    to={`/company/applicants/${job.id}`}
                    className="btn-primary btn-sm w-full justify-center"
                  >
                    View Applicants ({job._count?.applications || 0})
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
