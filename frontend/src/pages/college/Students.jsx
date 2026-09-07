import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { StatusBadge, SkillTag } from '../../components/Badges'
import { TableRowSkeleton, EmptyState } from '../../components/Skeletons'
import api from '../../api/client'
import {
  GraduationCap,
  Search,
  Calendar,
  ArrowLeft,
  Users,
  Building2,
  MapPin,
  Mail,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
} from 'lucide-react'

export default function CollegeStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('')

  useEffect(() => {
    api
      .get(`/college/students${yearFilter ? `?graduationYear=${yearFilter}` : ''}`)
      .then((r) => setStudents(r.data))
      .finally(() => setLoading(false))
  }, [yearFilter])

  const filtered = students.filter(
    (s) =>
      !search ||
      s.user.name.toLowerCase().includes(search.toLowerCase()) ||
      s.degree.toLowerCase().includes(search.toLowerCase())
  )

  const years = [...new Set(students.map((s) => s.graduationYear))].sort((a, b) => b - a)

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Context */}
        <div className="flex items-center justify-between">
          <Link
            to="/college/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Institutional Cohort Registry</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Enrolled Ayush Students
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking {students.length} students across Ayurveda, Yoga, Unani, Siddha and Homeopathy faculties.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                placeholder="Search by student name or degree..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All Academic Batches</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    Batch of {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Student Information
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Academic Degree
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mapped Skills
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Applications
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Career Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => <TableRowSkeleton key={i} cols={5} />)
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <EmptyState
                        icon={<Users className="w-8 h-8 text-emerald-600" />}
                        title="No students located"
                        description="Try searching with a different name or clear the batch filter."
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Student info */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                            {s.user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 leading-tight">
                              {s.user.name}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{s.user.email}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-300" />
                              <span>
                                {s.city}, {s.state}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Degree & Batch */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-xs text-slate-800">{s.degree}</div>
                        <div className="text-xs font-bold text-emerald-700 mt-0.5">
                          Batch of {s.graduationYear}
                        </div>
                      </td>

                      {/* Skills */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {s.skills.slice(0, 3).map(({ skill }) => (
                            <SkillTag key={skill.id} name={skill.name} system={skill.system} />
                          ))}
                          {s.skills.length > 3 && (
                            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              +{s.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Applications */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                          <Briefcase className="w-3 h-3 text-slate-500" />
                          <span>{s.totalApplications} applied</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {s.placed ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Placed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>In Progress</span>
                          </span>
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
