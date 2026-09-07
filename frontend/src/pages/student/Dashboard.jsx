import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import { StatusBadge, SkillTag, JobTypeBadge } from '../../components/Badges'
import { StatSkeleton, CardSkeleton, EmptyState } from '../../components/Skeletons'
import api from '../../api/client'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/student/profile').then(r => setProfile(r.data)),
      api.get('/student/applications').then(r => setApplications(r.data)),
      api.get('/jobs').then(r => setJobs(r.data.slice(0, 3))),
    ]).finally(() => setLoading(false))
  }, [])

  const stats = [
    { icon: '📋', label: 'Applications', value: applications.length, color: 'bg-blue-500' },
    { icon: '⭐', label: 'Shortlisted', value: applications.filter(a => a.status === 'SHORTLISTED').length, color: 'bg-amber-500' },
    { icon: '✅', label: 'Accepted', value: applications.filter(a => a.status === 'ACCEPTED').length, color: 'bg-green-600' },
    { icon: '🏷️', label: 'Skills Tagged', value: profile?.skills?.length || 0, color: 'bg-ayush-primary' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="section-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="section-subtitle">
            {profile?.degree} · {profile?.institution} · Batch of {profile?.graduationYear}
          </p>
        </div>

        {/* Profile completeness alert */}
        {profile && !profile.resumeUrl && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-medium text-amber-800 text-sm">Complete your profile to get noticed</p>
              <p className="text-xs text-amber-700">Upload your resume and add more skills to improve your match score.</p>
            </div>
            <Link to="/student/profile" className="ml-auto btn-sm btn bg-amber-600 text-white hover:bg-amber-700">Update Profile</Link>
          </div>
        )}

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills */}
          <div className="card lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ayush-dark">My Ayush Skills</h2>
              <Link to="/student/profile" className="text-xs text-ayush-primary hover:underline">Manage →</Link>
            </div>
            {loading ? (
              <div className="flex flex-wrap gap-2">
                {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-6 w-20 rounded-full" />)}
              </div>
            ) : profile?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(({ skill }) => (
                  <SkillTag key={skill.id} name={skill.name} system={skill.system} />
                ))}
              </div>
            ) : (
              <EmptyState icon="🏷️" title="No skills yet" description="Add your Ayush skills to get better job matches" />
            )}
          </div>

          {/* Recent applications */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ayush-dark">Recent Applications</h2>
              <Link to="/student/applications" className="text-xs text-ayush-primary hover:underline">View all →</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{Array(3).fill(0).map((_, i) => <CardSkeleton key={i} lines={2} />)}</div>
            ) : applications.length > 0 ? (
              <div className="space-y-3">
                {applications.slice(0, 4).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm text-slate-800">{app.job.title}</div>
                      <div className="text-xs text-slate-500">{app.job.company.name} · {app.job.location}</div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="📋" title="No applications yet" description="Browse available jobs and apply to get started" />
            )}
            {!loading && applications.length === 0 && (
              <Link to="/student/jobs" className="btn-primary w-full justify-center mt-4">Browse Jobs →</Link>
            )}
          </div>
        </div>

        {/* Latest jobs */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ayush-dark text-lg">Latest Opportunities</h2>
            <Link to="/student/jobs" className="text-sm text-ayush-primary hover:underline">See all jobs →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="card-hover">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-sm text-ayush-dark leading-tight">{job.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{job.company.name}</p>
                    </div>
                    <JobTypeBadge type={job.type} />
                  </div>
                  <p className="text-xs text-slate-500 mb-3">📍 {job.location}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skills.slice(0, 3).map(({ skill }) => (
                      <SkillTag key={skill.id} name={skill.name} system={skill.system} />
                    ))}
                    {job.skills.length > 3 && <span className="text-xs text-slate-400">+{job.skills.length - 3}</span>}
                  </div>
                  <Link to="/student/jobs" className="btn-secondary btn-sm w-full justify-center">View Job</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
