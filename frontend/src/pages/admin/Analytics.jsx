import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { StatSkeleton, EmptyState } from '../../components/Skeletons'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import api from '../../api/client'
import {
  GraduationCap,
  Building2,
  Landmark,
  Briefcase,
  Send,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  MapPin,
  Award,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react'

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/analytics/overview')
      .then((r) => setData(r.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  const overview = data?.overview

  const stats = overview
    ? [
        {
          icon: GraduationCap,
          label: 'Total Students',
          value: overview.totalStudents,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        {
          icon: Building2,
          label: 'Ayush Enterprises',
          value: overview.totalCompanies,
          color: 'bg-blue-50 text-blue-700 border-blue-200',
        },
        {
          icon: Landmark,
          label: 'Colleges / Inst.',
          value: overview.totalColleges,
          color: 'bg-violet-50 text-violet-700 border-violet-200',
        },
        {
          icon: Briefcase,
          label: 'Active Listings',
          value: overview.totalJobs,
          color: 'bg-sky-50 text-sky-700 border-sky-200',
        },
        {
          icon: Send,
          label: 'Applications',
          value: overview.totalApplications,
          color: 'bg-amber-50 text-amber-700 border-amber-200',
        },
        {
          icon: CheckCircle2,
          label: 'Verified Placements',
          value: overview.placedStudents,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        {
          icon: TrendingUp,
          label: 'Placement Success',
          value: `${overview.placementRate}%`,
          color: 'bg-teal-50 text-teal-700 border-teal-200',
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header with National Emblems */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          {/* Subtle tricolor top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ministry of Ayush · SIH26044 National Observatory</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                National Ayush Skill Mapping & Placement Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Real-time algorithmic monitoring across Ayurveda, Yoga, Naturopathy, Unani, Siddha, and Homeopathy healthcare sectors.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/80 text-right">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Data Stream
                </div>
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 justify-end mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active Live Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* 7 KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {loading
            ? Array(7)
                .fill(0)
                .map((_, i) => <StatSkeleton key={i} />)
            : stats.map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col items-center text-center hover:border-slate-300 transition-all"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 border shadow-inner ${s.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="font-display font-black text-xl text-slate-900 leading-tight">
                      {s.value}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                      {s.label}
                    </div>
                  </div>
                )
              })}
        </div>

        {data && (
          <>
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top demanded skills */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-700" />
                      <span>Top 10 In-Demand Ayush Competencies</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Most requested skills across active hospital & pharmaceutical listings
                    </p>
                  </div>
                </div>

                {data.topSkillsDemand.length > 0 ? (
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={data.topSkillsDemand}
                        layout="vertical"
                        margin={{ left: 0, right: 24, top: 4, bottom: 4 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          tick={{ fontSize: 11, fill: '#334155' }}
                          width={150}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f4c35',
                            borderRadius: '12px',
                            border: 'none',
                            color: '#fff',
                            fontSize: '12px',
                          }}
                          formatter={(v) => [`${v} Active Openings`, 'Demand Count']}
                        />
                        <Bar
                          dataKey="count"
                          fill="#0f4c35"
                          radius={[0, 6, 6, 0]}
                          label={{ position: 'right', fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState
                    icon={<BarChart3 className="w-8 h-8 text-emerald-600" />}
                    title="No demand data recorded yet"
                  />
                )}
              </div>

              {/* Students by state */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <span>Geographic Student Distribution</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Registered Ayush practitioner candidates by home Indian State / UT
                    </p>
                  </div>
                </div>

                {data.studentsByState.length > 0 ? (
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={data.studentsByState.slice(0, 10)}
                        layout="vertical"
                        margin={{ left: 0, right: 24, top: 4, bottom: 4 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                        <YAxis
                          type="category"
                          dataKey="state"
                          tick={{ fontSize: 11, fill: '#334155' }}
                          width={110}
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
                        <Bar
                          dataKey="count"
                          fill="#16a34a"
                          radius={[0, 6, 6, 0]}
                          label={{ position: 'right', fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState
                    icon={<MapPin className="w-8 h-8 text-emerald-600" />}
                    title="No geographic records"
                  />
                )}
              </div>
            </div>

            {/* Monthly Trend Area / Line Chart */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span>Monthly Trajectory: Registrations & Applications</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    12-month nationwide adoption dynamics on the SIH26044 collaborative portal
                  </p>
                </div>
              </div>

              {data.monthlyTrend.length > 0 ? (
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart
                      data={data.monthlyTrend}
                      margin={{ top: 10, right: 24, bottom: 4, left: 0 }}
                    >
                      <defs>
                        <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0f4c35" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#0f4c35" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4a017" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f4c35',
                          borderRadius: '12px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Area
                        type="monotone"
                        dataKey="registrations"
                        stroke="#0f4c35"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#regGrad)"
                        name="Portal Registrations"
                      />
                      <Area
                        type="monotone"
                        dataKey="applications"
                        stroke="#d4a017"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#appGrad)"
                        name="Candidate Applications"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState
                  icon={<TrendingUp className="w-8 h-8 text-emerald-600" />}
                  title="No trajectory records yet"
                />
              )}
            </div>

            {/* College Leaderboard */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>National Institutional Placement Leaderboard</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Recognizing top-performing Ayush colleges ranked by industry placement outcomes
                  </p>
                </div>
              </div>

              {data.collegeLeaderboard.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200/80">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Rank
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Institution Name
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          State
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Enrolled
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Verified Placed
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                          Institutional Placement Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.collegeLeaderboard.map((c, i) => (
                        <tr key={c.college} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-4">
                            <span
                              className={`w-7 h-7 rounded-full text-xs font-black inline-flex items-center justify-center ${
                                i === 0
                                  ? 'bg-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-300'
                                  : i === 1
                                  ? 'bg-slate-300 text-slate-800'
                                  : i === 2
                                  ? 'bg-amber-700 text-amber-100'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              #{i + 1}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-sm text-slate-900">
                            {c.college}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500">
                            {c.state}
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                            {c.totalStudents} students
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-emerald-700">
                            {c.placed} placed
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full"
                                  style={{ width: `${c.placementRate}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-emerald-800">
                                {c.placementRate}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon={<Award className="w-8 h-8 text-emerald-600" />}
                  title="No college performance data yet"
                  description="Metrics will update as academic institutions verify placements."
                />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
