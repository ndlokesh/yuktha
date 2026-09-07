import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import { StatSkeleton, EmptyState } from '../../components/Skeletons'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../api/client'
import toast from 'react-hot-toast'

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

  useEffect(() => { fetchData() }, [selectedYear])

  const handleVerify = async (userId, action) => {
    setVerifying(p => ({ ...p, [userId]: true }))
    try {
      await api.patch(`/college/verify/${userId}`, { action })
      toast.success(`Student ${action === 'approve' ? 'approved' : 'rejected'}!`)
      fetchData()
    } catch {
      toast.error('Action failed')
    } finally {
      setVerifying(p => ({ ...p, [userId]: false }))
    }
  }

  const stats = analytics ? [
    { icon: '👩‍🎓', label: 'Total Students', value: analytics.totalStudents, color: 'bg-ayush-primary' },
    { icon: '✅', label: 'Placed Students', value: analytics.placed, color: 'bg-green-600' },
    { icon: '📊', label: 'Placement Rate', value: `${analytics.placementRate}%`, color: 'bg-blue-500' },
    { icon: '⏳', label: 'Pending Verification', value: pending.length, color: 'bg-amber-500' },
  ] : []

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="section-title">{user?.college?.name || 'College Dashboard'}</h1>
            <p className="section-subtitle">Placement analytics and student management</p>
          </div>
          <Link to="/college/students" className="btn-secondary">View All Students →</Link>
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

        {/* Pending verifications */}
        {pending.length > 0 && (
          <div className="card mb-8 border-l-4 border-amber-400">
            <h2 className="font-semibold text-ayush-dark mb-4 flex items-center gap-2">
              ⏳ Pending Student Verifications
              <span className="badge-amber">{pending.length}</span>
            </h2>
            <div className="space-y-3">
              {pending.map((p) => (
                <div key={p.userId} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm text-slate-800">{p.user.name}</div>
                    <div className="text-xs text-slate-500">{p.user.email} · {p.degree} · {p.institution}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={verifying[p.userId]}
                      onClick={() => handleVerify(p.userId, 'approve')}
                      className="btn bg-green-100 text-green-700 hover:bg-green-200 btn-sm"
                    >
                      ✓ Approve
                    </button>
                    <button
                      disabled={verifying[p.userId]}
                      onClick={() => handleVerify(p.userId, 'reject')}
                      className="btn bg-red-100 text-red-700 hover:bg-red-200 btn-sm"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts row */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top skills */}
            <div className="card">
              <h2 className="font-semibold text-ayush-dark mb-4">Top Skills Among Students</h2>
              {analytics.topSkills.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analytics.topSkills} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={140} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0f4c35" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <EmptyState icon="📊" title="No data yet" />}
            </div>

            {/* Batch-wise breakdown */}
            <div className="card">
              <h2 className="font-semibold text-ayush-dark mb-4">Batch-wise Placement</h2>
              {analytics.batches.length > 0 ? (
                <div className="space-y-3">
                  {analytics.batches.map((b) => (
                    <div key={b.year} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-600 w-12">{b.year}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full bg-ayush-primary rounded-full transition-all"
                          style={{ width: `${b.total ? (b.placed / b.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-24 text-right">
                        {b.placed}/{b.total} ({b.total ? Math.round((b.placed / b.total) * 100) : 0}%)
                      </span>
                    </div>
                  ))}
                </div>
              ) : <EmptyState icon="📈" title="No batch data yet" />}
            </div>
          </div>
        )}

        {/* Top hiring companies */}
        {analytics?.topCompanies?.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-ayush-dark mb-4">Top Hiring Companies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {analytics.topCompanies.map((c, i) => (
                <div key={c.name} className="p-3 bg-ayush-light rounded-lg text-center">
                  <div className="text-2xl font-bold text-ayush-primary mb-1">#{i + 1}</div>
                  <div className="text-sm font-medium text-ayush-dark leading-tight">{c.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{c.count} hires</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
