import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  Handshake,
  ArrowRight,
} from 'lucide-react'

export default function PostCollaboration() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    type: 'FACULTY_INTERNSHIP',
    domain: '',
    description: '',
    requirements: '',
    budgetOrStipend: '',
    duration: '6 Weeks',
    location: 'Bengaluru R&D Center (Onsite)',
    deadline: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/collaboration/opportunities', form)
      toast.success('Collaboration opportunity published successfully!')
      navigate('/company/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post collaboration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
            <Handshake className="w-3.5 h-3.5" />
            <span>Academic Alliances & Research Co-development</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Post Academia–Industry Collaboration RFP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Engage university faculty members through sponsored industrial internships, collaborative grants, and consultancy.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Opportunity Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Faculty Industrial Immersion: Phytochemical Standardization & Analytics"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Collaboration Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 outline-none focus:border-cyan-500"
              >
                <option value="FACULTY_INTERNSHIP">Faculty Internship & Industrial Immersion</option>
                <option value="RESEARCH_PROJECT">Joint Research Grant / Project</option>
                <option value="FDP">Faculty Development Program (FDP)</option>
                <option value="CONSULTANCY">Consultancy / Expert Advisory RFP</option>
                <option value="GUEST_LECTURE">Guest Lecture / Academic Series</option>
                <option value="INNOVATION_CHALLENGE">Innovation Hackathon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Domain / Research Area *</label>
              <input
                type="text"
                required
                placeholder="e.g. Phytochemistry, Clinical Pharmacology, AI/ML"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Funding / Stipend / Honorarium
              </label>
              <input
                type="text"
                placeholder="e.g. ₹45,000 / month or ₹8,00,000 grant"
                value={form.budgetOrStipend}
                onChange={(e) => setForm({ ...form, budgetOrStipend: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration</label>
              <input
                type="text"
                placeholder="e.g. 6 Weeks, 12 Months"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Submission Deadline *</label>
              <input
                type="date"
                required
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location / Work Mode</label>
            <input
              type="text"
              placeholder="e.g. Hybrid / Onsite Bengaluru R&D Center"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description & Scope *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the research objective, corporate facilities provided, and target outcomes..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Faculty Eligibility Requirements *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Ph.D or MD in Pharmacology, Phytochemistry, with minimum 3 years academic teaching experience..."
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 leading-relaxed"
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
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/40 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Posting...' : 'Post Opportunity'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
