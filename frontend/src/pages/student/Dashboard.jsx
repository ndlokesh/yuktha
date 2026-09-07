import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import { StatusBadge, SkillTag, JobTypeBadge } from '../../components/Badges'
import { StatSkeleton, CardSkeleton, EmptyState } from '../../components/Skeletons'
import api from '../../api/client'
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Tag,
  MapPin,
  ArrowRight,
  Upload,
  Briefcase,
  AlertTriangle,
  ChevronRight,
  GraduationCap,
  Building2,
  TrendingUp,
} from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/student/profile').then((r) => setProfile(r.data)),
      api.get('/student/applications').then((r) => setApplications(r.data)),
      api.get('/jobs').then((r) => setJobs(r.data.slice(0, 3))),
    ]).finally(() => setLoading(false))
  }, [])

  const stats = [
    {
      icon: FileText,
      label: 'Applications',
      value: applications.length,
      color: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
    {
      icon: Sparkles,
      label: 'Shortlisted',
      value: applications.filter((a) => a.status === 'SHORTLISTED').length,
      color: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    {
      icon: CheckCircle2,
      label: 'Accepted',
      value: applications.filter((a) => a.status === 'ACCEPTED').length,
      color: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      icon: Tag,
      label: 'Verified Skills',
      value: profile?.skills?.length || 0,
      color: 'bg-teal-50 text-teal-700 border border-teal-200',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Academic Workspace</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {profile?.degree} · {profile?.institution} · Batch of {profile?.graduationYear}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/jobs"
              className="btn-primary py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-900/20"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Jobs</span>
            </Link>
            <Link
              to="/student/profile"
              className="btn-secondary py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-slate-500" />
              <span>Edit Skills</span>
            </Link>
          </div>
        </div>

        {/* Profile completeness alert */}
        {profile && !profile.resumeUrl && (
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-amber-950 text-sm">Upload Resume to Maximize Match Score</p>
                <p className="text-xs text-amber-800 mt-0.5">
                  Ayush recruiters filter candidates by verified portfolio and curriculum vitae.
                </p>
              </div>
            </div>
            <Link
              to="/student/profile"
              className="btn-accent text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Resume</span>
            </Link>
          </div>
        )}

        {/* KPI Stats */}
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
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${s.color}`}>
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

        {/* Two Columns: Skills & Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tagged Skills */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-700" />
                  <h2 className="font-display font-bold text-base text-slate-900">My Ayush Skills</h2>
                </div>
                <Link
                  to="/student/profile"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
                >
                  <span>Manage</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {loading ? (
                <div className="flex flex-wrap gap-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="skeleton h-6 w-20 rounded-full" />
                    ))}
                </div>
              ) : profile?.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map(({ skill }) => (
                    <SkillTag key={skill.id} name={skill.name} system={skill.system} />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No skills tagged yet</p>
                  <Link
                    to="/student/profile"
                    className="inline-block mt-3 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Select skills from 46+ taxonomy →
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Taxonomy: SIH26044 Verified</span>
              <span className="font-semibold text-emerald-700">{profile?.skills?.length || 0} active</span>
            </div>
          </div>

          {/* Recent applications */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h2 className="font-display font-bold text-base text-slate-900">Recent Applications</h2>
              </div>
              <Link
                to="/student/applications"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
              >
                <span>Track All</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <CardSkeleton key={i} lines={2} />
                  ))}
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-2.5">
                {applications.slice(0, 4).map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-2xl transition-all"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">{app.job.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="font-medium text-slate-700">{app.job.company.name}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {app.job.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <JobTypeBadge type={app.job.type} />
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No applications submitted yet</p>
                <p className="text-xs text-slate-400 mt-1">Explore job listings matched to your Ayush competencies</p>
                <Link
                  to="/student/jobs"
                  className="btn-primary py-2 px-5 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 mt-4"
                >
                  <span>Explore Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Latest Opportunities Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <h2 className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
                Recommended Opportunities
              </h2>
            </div>
            <Link
              to="/student/jobs"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>View All Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-500/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{job.company.name}</span>
                        </p>
                      </div>
                      <JobTypeBadge type={job.type} />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{job.location}</span>
                      </span>
                      {job.stipend && (
                        <>
                          <span>·</span>
                          <span className="font-semibold text-emerald-800">{job.stipend}</span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {job.skills.slice(0, 3).map(({ skill }) => (
                        <SkillTag key={skill.id} name={skill.name} system={skill.system} size="xs" />
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-[11px] font-semibold text-slate-400 self-center">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/student/jobs"
                    className="btn-secondary w-full justify-center py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 group-hover:bg-emerald-50 group-hover:text-emerald-800 group-hover:border-emerald-200 transition-all cursor-pointer"
                  >
                    <span>View & Apply</span>
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
