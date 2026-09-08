import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/client'
import toast from 'react-hot-toast'
import { ArrowRight } from 'lucide-react'

export default function PostProgram() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'CERTIFICATION',
    targetAudience: 'ALL',
    description: '',
    duration: '4 Weeks (30 Hours)',
    mode: 'ONLINE',
    skillsCovered: '',
    syllabus: '',
    instructorName: '',
    enrollmentCap: 150,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/learning', form)
      toast.success('Industry learning program published successfully!')
      navigate('/company/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to publish program')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Talent Enablement & Pre-Hiring Training</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Publish Industry Learning Program
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Train students and faculty in specialized competencies required for your active vacancies.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Program Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Advanced Certification in Clinical Trials & GCP Compliance"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 outline-none focus:border-emerald-500"
              >
                <option value="CERTIFICATION">Industry Certification</option>
                <option value="COURSE">Technical Course</option>
                <option value="FDP">Faculty Dev Program (FDP)</option>
                <option value="WORKSHOP">Hands-on Workshop</option>
                <option value="MENTORSHIP">Mentorship Initiative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Audience *</label>
              <select
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 outline-none focus:border-emerald-500"
              >
                <option value="ALL">All (Students & Faculty)</option>
                <option value="STUDENT">Students Only</option>
                <option value="FACULTY">Faculty / Academicians Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Delivery Mode *</label>
              <select
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 outline-none focus:border-emerald-500"
              >
                <option value="ONLINE">Online Virtual</option>
                <option value="HYBRID">Hybrid (Online + Labs)</option>
                <option value="OFFLINE">Onsite Corporate Campus</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration *</label>
              <input
                type="text"
                required
                placeholder="e.g. 6 Weeks (40 Hours)"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Instructor / Lead Mentor</label>
              <input
                type="text"
                placeholder="e.g. Dr. Anita Nambiar, Head of Medical Affairs"
                value={form.instructorName}
                onChange={(e) => setForm({ ...form, instructorName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Skills Covered (Comma-separated) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Clinical Trials & GCP Compliance, Pharmacovigilance & Drug Safety, CTRI Documentation"
              value={form.skillsCovered}
              onChange={(e) => setForm({ ...form, skillsCovered: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Program Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Provide a summary of learning outcomes, industry practical projects, and evaluation benchmarks..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Syllabus Outline (Optional)</label>
            <textarea
              rows={3}
              placeholder="Module 1: Foundations\nModule 2: Advanced Practice\nModule 3: Capstone Evaluation"
              value={form.syllabus}
              onChange={(e) => setForm({ ...form, syllabus: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 font-mono text-[11px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate('/company/dashboard')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Publishing...' : 'Publish Program'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
