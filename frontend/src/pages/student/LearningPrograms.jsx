import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  Award,
  Clock,
  Building2,
  CheckCircle2,
  Search,
  ArrowRight,
  Sparkles,
  PlayCircle,
  Users,
} from 'lucide-react'

export default function LearningPrograms() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedMode, setSelectedMode] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [enrollingId, setEnrollingId] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // all | my_enrollments
  const [myEnrollments, setMyEnrollments] = useState([])

  useEffect(() => {
    fetchPrograms()
    fetchMyEnrollments()
  }, [selectedCategory, selectedMode, searchQuery])

  const fetchPrograms = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedCategory) params.category = selectedCategory
      if (selectedMode) params.mode = selectedMode
      if (searchQuery) params.search = searchQuery

      const { data } = await api.get('/learning', { params })
      setPrograms(data)
    } catch (err) {
      console.error('Fetch programs error:', err)
      toast.error('Failed to load learning programs')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyEnrollments = async () => {
    try {
      const { data } = await api.get('/learning/user/my-programs')
      setMyEnrollments(data)
    } catch (err) {
      console.error('Fetch my enrollments error:', err)
    }
  }

  const handleEnroll = async (programId) => {
    setEnrollingId(programId)
    try {
      await api.post(`/learning/${programId}/enroll`)
      toast.success('Successfully enrolled in program!')
      fetchPrograms()
      fetchMyEnrollments()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to enroll')
    } finally {
      setEnrollingId(null)
    }
  }

  const handleUpdateProgress = async (enrollmentId, currentProgress) => {
    const nextProgress = Math.min(currentProgress + 25, 100)
    try {
      await api.patch(`/learning/enrollment/${enrollmentId}/progress`, {
        progress: nextProgress,
      })
      toast.success(nextProgress === 100 ? '🎉 Program completed! Certificate awarded.' : `Progress updated to ${nextProgress}%`)
      fetchMyEnrollments()
      fetchPrograms()
    } catch (err) {
      toast.error('Failed to update progress')
    }
  }

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'CERTIFICATION', label: 'Certifications' },
    { value: 'COURSE', label: 'Industry Courses' },
    { value: 'FDP', label: 'Faculty Dev Programs' },
    { value: 'WORKSHOP', label: 'Workshops' },
  ]

  const modes = [
    { value: '', label: 'All Modes' },
    { value: 'ONLINE', label: 'Online' },
    { value: 'HYBRID', label: 'Hybrid' },
    { value: 'OFFLINE', label: 'On-Premise' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Industry-Published Learning & Skill Modules</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Industry Learning & Certification Programs
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Equip yourself with the exact technical competencies and clinical safety practices demanded by leading organizations.
              Earn verifiable digital badges and closing your evaluated skill gaps.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Explore Programs ({programs.length})
            </button>
            <button
              onClick={() => setActiveTab('my_enrollments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'my_enrollments' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              My Enrolled Courses ({myEnrollments.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        {activeTab === 'all' && (
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by topic, skill, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 focus:border-emerald-500 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 focus:border-emerald-500 outline-none"
              >
                {modes.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-slate-400">Loading industry learning catalog...</div>
          </div>
        ) : activeTab === 'all' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900 border border-white/10 rounded-3xl p-6 hover:border-emerald-500/30 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {p.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {p.duration} · {p.mode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{p.title}</h3>
                  <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mb-3">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Published by {p.companyName}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                    {p.description}
                  </p>

                  {p.skillsCovered && (
                    <div className="space-y-1.5 pt-3 border-t border-white/5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Competencies Taught:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {p.skillsCovered.split(',').map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {p.instructorName && (
                    <div className="text-[11px] text-slate-400 mt-3 italic">
                      Instructor: <span className="text-slate-200 font-medium">{p.instructorName}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{p.enrolledCount} learners enrolled</span>
                  </div>

                  {p.isEnrolled ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Enrolled ({p.userProgress}%)</span>
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnroll(p.id)}
                      disabled={enrollingId === p.id}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <span>{enrollingId === p.id ? 'Enrolling...' : 'Enroll Free'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* My Enrollments Tab */
          <div className="space-y-4">
            {myEnrollments.length === 0 ? (
              <div className="text-center py-16 bg-slate-900 border border-white/10 rounded-2xl text-slate-400 text-xs">
                You have not enrolled in any learning programs yet. Browse the catalog to start learning!
              </div>
            ) : (
              myEnrollments.map((enr) => (
                <div
                  key={enr.enrollmentId}
                  className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {enr.category}
                      </span>
                      <span className="text-xs text-slate-400">{enr.companyName}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{enr.title}</h3>
                    <div className="text-xs text-slate-400">Duration: {enr.duration} · {enr.mode}</div>

                    {/* Progress Bar */}
                    <div className="pt-2 max-w-md">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Course Progress</span>
                        <span className="font-bold text-emerald-400">{enr.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enr.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    {enr.certificateIssued ? (
                      <a
                        href={enr.certificateUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                      >
                        <Award className="w-4 h-4" />
                        <span>View Verified Certificate</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => handleUpdateProgress(enr.enrollmentId, enr.progress)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Continue Lesson (+25%)</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
