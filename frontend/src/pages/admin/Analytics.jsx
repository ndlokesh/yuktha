import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { StatSkeleton, EmptyState } from '../../components/Skeletons'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'
import api from '../../api/client'

const COLORS = ['#0f4c35', '#1a7a52', '#d4a017', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f59e0b', '#ef4444']

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/analytics/overview')
      .then(r => setData(r.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  const overview = data?.overview

  const stats = overview ? [
    { icon: '👩‍🎓', label: 'Total Students', value: overview.totalStudents, color: 'bg-ayush-primary' },
    { icon: '🏢', label: 'Companies', value: overview.totalCompanies, color: 'bg-blue-500' },
    { icon: '🏛️', label: 'Institutions', value: overview.totalColleges, color: 'bg-violet-500' },
    { icon: '📋', label: 'Job Listings', value: overview.totalJobs, color: 'bg-sky-500' },
    { icon: '📨', label: 'Applications', value: overview.totalApplications, color: 'bg-amber-500' },
    { icon: '✅', label: 'Placements', value: overview.placedStudents, color: 'bg-green-600' },
    { icon: '📊', label: 'Placement Rate', value: `${overview.placementRate}%`, color: 'bg-teal-600' },
  ] : []

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🇮🇳</span>
            <div>
              <h1 className="section-title">Ministry of Ayush — National Analytics</h1>
              <p className="section-subtitle">Academia-Industry Collaboration Dashboard · SIH26044</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">{error}</div>
        )}

        {/* KPI grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
          {loading ? Array(7).fill(0).map((_, i) => <StatSkeleton key={i} />) :
            stats.map((s) => (
              <div key={s.label} className="stat-card flex-col items-center text-center p-4">
                <div className={`stat-icon ${s.color} mb-2 mx-auto`}>{s.icon}</div>
                <div className="stat-value text-2xl">{s.value}</div>
                <div className="stat-label text-xs">{s.label}</div>
              </div>
            ))
          }
        </div>

        {data && (
          <>
            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Top demanded skills */}
              <div className="card">
                <h2 className="font-semibold text-ayush-dark mb-4">Top 10 In-Demand Ayush Skills</h2>
                {data.topSkillsDemand.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.topSkillsDemand} layout="vertical" margin={{ left: 0, right: 20, top: 4, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={150} />
                      <Tooltip formatter={(v) => [v, 'Job postings requiring this skill']} />
                      <Bar dataKey="count" fill="#0f4c35" radius={[0, 4, 4, 0]}
                        label={{ position: 'right', fontSize: 10, fill: '#64748b' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <EmptyState icon="📊" title="No data yet" />}
              </div>

              {/* Students by state */}
              <div className="card">
                <h2 className="font-semibold text-ayush-dark mb-4">Students by State</h2>
                {data.studentsByState.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.studentsByState.slice(0, 10)} layout="vertical" margin={{ left: 0, right: 20, top: 4, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                      <YAxis type="category" dataKey="state" tick={{ fontSize: 10 }} width={90} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1a7a52" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <EmptyState icon="🗺️" title="No state data yet" />}
              </div>
            </div>

            {/* Monthly trend */}
            <div className="card mb-6">
              <h2 className="font-semibold text-ayush-dark mb-4">Monthly Registration & Application Trend (Last 12 Months)</h2>
              {data.monthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.monthlyTrend} margin={{ top: 4, right: 20, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="registrations" stroke="#0f4c35" strokeWidth={2} dot={{ r: 3 }} name="New Registrations" />
                    <Line type="monotone" dataKey="applications" stroke="#d4a017" strokeWidth={2} dot={{ r: 3 }} name="Applications" />
                  </LineChart>
                </ResponsiveContainer>
              ) : <EmptyState icon="📈" title="No trend data yet" />}
            </div>

            {/* College leaderboard */}
            <div className="card">
              <h2 className="font-semibold text-ayush-dark mb-4">College Placement Leaderboard</h2>
              {data.collegeLeaderboard.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">#</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Institution</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">State</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Students</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Placed</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.collegeLeaderboard.map((c, i) => (
                        <tr key={c.college} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-bold text-ayush-primary">#{i + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-ayush-dark">{c.college}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{c.state}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">{c.totalStudents}</td>
                          <td className="px-4 py-3 text-sm text-green-700 font-semibold">{c.placed}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                <div className="bg-ayush-primary h-full rounded-full" style={{ width: `${c.placementRate}%` }} />
                              </div>
                              <span className="text-xs font-semibold text-ayush-primary">{c.placementRate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState icon="🏆" title="No college data yet" description="Data will appear as colleges and students register" />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
