import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import { StatSkeleton, EmptyState } from '../../components/Skeletons'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  Check,
  X,
  Building2,
  Sparkles,
  Award,
  ArrowRight,
  Filter,
  BarChart3,
  Calendar,
  AlertCircle,
} from 'lucide-react'

export default function CollegeDashboard() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState({})
  const [selectedYear, setSelectedYear] = useState('')

  const fetchData = async () => {
    try {
      const [analyticsRes, pendingRes] = await Promise.all([
        api.get(`/college/analytics${selectedYear ? `?graduationYear=${selectedYear}` : ''}`),
        api.get('/college/pending'),
      ])
      setAnalytics(analyticsRes.data)
      setPending(pendingRes.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedYear])

  const handleVerify = async (userId, action) => {
    setVerifying((p) => ({ ...p, [userId]: true }))
    try {
      await api.patch(`/college/verify/${userId}`, { action })
      toast.success(`Student enrollment ${action === 'approve' ? 'verified & approved' : 'rejected'}`)
      fetchData()
    } catch {
      toast.error('Verification update failed')
    } finally {
      setVerifying((p) => ({ ...p, [userId]: false }))
    }
  }

  const stats = analytics
    ? [
        {
          icon: GraduationCap,
          label: 'Enrolled Students',
          value: analytics.totalStudents,
          color: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        },
        {
          icon: CheckCircle2,
          label: 'Placed Students',
          value: analytics.placed,
          color: 'bg-teal-50 text-teal-700 border border-teal-200',
        },
        {
          icon: TrendingUp,
          label: 'Institutional Placement Rate',
          value: `${analytics.placementRate}%`,
          color: 'bg-blue-50 text-blue-700 border border-blue-200',
        },
        {
          icon: Clock,
          label: 'Pending Verifications',
          value: pending.length,
          color: 'bg-amber-50 text-amber-700 border border-amber-200',
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Ayush Academic Institution Portal</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              {user?.college?.name || 'Institutional Administration'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {user?.college?.university || 'Ayush University Affiliation'} · {user?.college?.state || 'India'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/college/students"
              className="btn-primary py-3 px-5 text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-900/20"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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

        {/* Pending Student Verifications Queue */}
        {pending.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs ring-1 ring-amber-100">
            <div className="flex items-center justify-between pb-4 border-b border-amber-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>Pending Institutional Verifications</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300/60">
                      {pending.length} Action Required
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Verify that these students are officially enrolled to grant them full access to company applications
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {pending.map((p) => (
                <div
                  key={p.userId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 font-black text-sm flex items-center justify-center flex-shrink-0">
                      {p.user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{p.user.name}</div>
                      <div className="text-xs text-slate-600 font-medium">
                        {p.degree} · Batch of {p.graduationYear || '2026'}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {p.user.email} · {p.institution}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      disabled={verifying[p.userId]}
                      onClick={() => handleVerify(p.userId, 'approve')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      {verifying[p.userId] ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Approve Enrollment</span>
                    </button>

                    <button
                      disabled={verifying[p.userId]}
                      onClick={() => handleVerify(p.userId, 'reject')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Charts Grid */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top skills chart */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  <h2 className="font-display font-bold text-slate-900 text-base">
                    Most Acquired Skills in Institution
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  Distribution of Ayush taxonomy competencies across enrolled cohorts
                </p>
              </div>

              {analytics.topSkills.length > 0 ? (
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={analytics.topSkills}
                      layout="vertical"
                      margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#334155' }}
                        width={140}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f4c35',
                          borderRadius: '12px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="count" fill="#0f4c35" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState
                  icon={<BarChart3 className="w-8 h-8 text-emerald-600" />}
                  title="No skill data yet"
                  description="Student skills will populate this visualization as profiles are verified."
                />
              )}
            </div>

            {/* Batch-wise breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <h2 className="font-display font-bold text-slate-900 text-base">
                      Graduation Batch Placement
                    </h2>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  Institutional conversion rate by academic passing year
                </p>
              </div>

              {analytics.batches.length > 0 ? (
                <div className="space-y-4">
                  {analytics.batches.map((b) => {
                    const percent = b.total ? Math.round((b.placed / b.total) * 100) : 0
                    return (
                      <div key={b.year} className="p-3 bg-slate-50/70 rounded-2xl border border-slate-200/60">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-slate-800">Batch of {b.year}</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                            {b.placed} / {b.total} Placed ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={<TrendingUp className="w-8 h-8 text-emerald-600" />}
                  title="No batch records available"
                />
              )}
            </div>
          </div>
        )}

        {/* Top Hiring Companies */}
        {analytics?.topCompanies?.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-emerald-700" />
              <h2 className="font-display font-bold text-slate-900 text-base">
                Leading Ayush Recruiters for this College
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Organizations extending verified offers to your graduates and interns
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {analytics.topCompanies.map((c, i) => (
                <div
                  key={c.name}
                  className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/30 border border-slate-200/80 text-center hover:border-emerald-500/40 hover:shadow-xs transition-all"
                >
                  <div
                    className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center mx-auto mb-2 ${
                      i === 0
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : i === 1
                        ? 'bg-slate-300 text-slate-800'
                        : i === 2
                        ? 'bg-amber-700 text-amber-100'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    #{i + 1}
                  </div>
                  <div className="font-bold text-sm text-slate-900 line-clamp-1 leading-snug">
                    {c.name}
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 mt-1">
                    {c.count} Hires
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
