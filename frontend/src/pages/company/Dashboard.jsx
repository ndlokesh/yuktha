import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import { JobTypeBadge } from '../../components/Badges'
import { StatSkeleton, CardSkeleton, EmptyState } from '../../components/Skeletons'
import api from '../../api/client'
import {
  Briefcase,
  Users,
  GraduationCap,
  Plus,
  ArrowRight,
  Building2,
  Calendar,
  Sparkles,
  MapPin,
  TrendingUp,
} from 'lucide-react'

export default function CompanyDashboard() {
  const { user } = useAuth()
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/company/profile'), api.get('/jobs/company/mine')])
      .then(([cRes, jRes]) => {
        setCompany(cRes.data)
        setJobs(jRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalApps = jobs.reduce((s, j) => s + (j._count?.applications || 0), 0)

  const stats = [
    {
      icon: Briefcase,
      label: 'Active Listings',
      value: jobs.filter((j) => j.isActive).length,
      color: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      icon: Users,
      label: 'Candidate Applications',
      value: totalApps,
      color: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
    {
      icon: GraduationCap,
      label: 'Internship Openings',
      value: jobs.filter((j) => j.type === 'INTERNSHIP').length,
      color: 'bg-violet-50 text-violet-700 border border-violet-200',
    },
    {
      icon: TrendingUp,
      label: 'Full-time Roles',
      value: jobs.filter((j) => j.type === 'JOB').length,
      color: 'bg-teal-50 text-teal-700 border border-teal-200',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Ayush Enterprise Recruitment</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {company?.name || user?.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {company?.sector} · {company?.city || 'Headquarters'}
            </p>
          </div>

          <Link
            to="/company/post-job"
            className="btn-primary py-3 px-5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-900/20"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Opening</span>
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => <StatSkeleton key={i} />)
            : stats.map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${s.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-display font-black text-2xl text-slate-900 leading-tight">
                        {s.value}
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                        {s.label}
                      </div>
                    </div>
                  </div>
                )
              })}
        </div>

        {/* Active Openings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
              Manage Active Openings
            </h2>
            <Link
              to="/company/post-job"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Create Listing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No active job listings</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Post clinical internships or permanent positions with Ayush taxonomy requirements.
              </p>
              <Link
                to="/company/post-job"
                className="btn-primary py-2.5 px-5 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Post First Position</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-base text-slate-900 leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{job.location}</span>
                        </p>
                      </div>
                      <JobTypeBadge type={job.type} />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-5">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{job._count?.applications || 0} applicants</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Closes {new Date(job.deadline).toLocaleDateString('en-IN')}</span>
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/company/applicants/${job.id}`}
                    className="btn-primary w-full justify-center py-2.5 text-xs font-bold rounded-xl flex items-center gap-2"
                  >
                    <span>View Ranked Applicants</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
