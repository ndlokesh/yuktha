import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { StatusBadge, SkillTag } from '../../components/Badges'
import { TableRowSkeleton, EmptyState } from '../../components/Skeletons'
import api from '../../api/client'

export default function CollegeStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('')

  useEffect(() => {
    api.get(`/college/students${yearFilter ? `?graduationYear=${yearFilter}` : ''}`)
      .then(r => setStudents(r.data))
      .finally(() => setLoading(false))
  }, [yearFilter])

  const filtered = students.filter(s =>
    !search || s.user.name.toLowerCase().includes(search.toLowerCase()) || s.degree.toLowerCase().includes(search.toLowerCase())
  )

  const years = [...new Set(students.map(s => s.graduationYear))].sort((a, b) => b - a)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="section-title">Student Registry</h1>
          <p className="section-subtitle">{students.length} students from your institution</p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Search Students</label>
              <input className="input" placeholder="Name or degree..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div>
              <label className="label">Graduation Year</label>
              <select className="input" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                <option value="">All batches</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Degree / Year</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState icon="👥" title="No students found" /></td></tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-ayush-dark">{s.user.name}</div>
                        <div className="text-xs text-slate-500">{s.user.email}</div>
                        <div className="text-xs text-slate-400">{s.city}, {s.state}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-700">{s.degree}</div>
                        <div className="text-xs text-slate-400">Batch of {s.graduationYear}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {s.skills.slice(0, 3).map(({ skill }) => (
                            <SkillTag key={skill.id} name={skill.name} system={skill.system} />
                          ))}
                          {s.skills.length > 3 && <span className="text-xs text-slate-400">+{s.skills.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-700">{s.totalApplications}</span>
                        <span className="text-xs text-slate-400 ml-1">apps</span>
                      </td>
                      <td className="px-6 py-4">
                        {s.placed ? (
                          <span className="badge-green">✓ Placed</span>
                        ) : (
                          <span className="badge-slate">Searching</span>
                        )}
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
