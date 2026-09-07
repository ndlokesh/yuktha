import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { SkillTag } from '../../components/Badges'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Banknote,
  Calendar,
  FileText,
  Sparkles,
  ArrowLeft,
  Check,
  Search,
  Layers,
  AlertCircle,
  Building2,
  Clock,
  Trash2,
} from 'lucide-react'

const SYSTEM_ORDER = [
  'Ayurveda',
  'Yoga & Naturopathy',
  'Unani',
  'Siddha',
  'Homeopathy',
  'Research & Clinical',
]

export default function PostJob() {
  const navigate = useNavigate()
  const [allSkills, setAllSkills] = useState({})
  const [selectedSkillIds, setSelectedSkillIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [skillSearch, setSkillSearch] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'INTERNSHIP',
    location: '',
    stipend: '',
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    api.get('/skills').then((r) => setAllSkills(r.data.grouped))
  }, [])

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Job / Internship title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.deadline) e.deadline = 'Application deadline is required'
    if (selectedSkillIds.length === 0) e.skills = 'Select at least one required Ayush skill'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await api.post('/jobs', { ...form, skillIds: selectedSkillIds })
      toast.success('Opportunity posted successfully!')
      navigate('/company/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post opportunity')
    } finally {
      setLoading(false)
    }
  }

  const toggleSkill = (id) => {
    setSelectedSkillIds((p) => (p.includes(id) ? p.filter((s) => s !== id) : [...p, id]))
    setErrors((e) => ({ ...e, skills: '' }))
  }

  const allSkillsFlat = Object.values(allSkills).flat()
  const selectedSkillsObjects = allSkillsFlat.filter((s) => selectedSkillIds.includes(s.id))

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <Link
            to="/company/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Ayush Talent Recruitment</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Create Ayush Opportunity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Specify verified clinical and academic competencies to automatically calculate algorithmic match scores for candidate applications.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Opportunity Details Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">Position Specifications</h3>
                <p className="text-xs text-slate-400">Basic details about role, type, compensation and timeline</p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Position Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all ${
                    errors.title ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200' : 'border-slate-200'
                  }`}
                  value={form.title}
                  onChange={set('title')}
                  placeholder="e.g. Senior Panchkarma Therapist & Clinical Resident"
                />
              </div>
              {errors.title && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Engagement Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: 'INTERNSHIP' }))}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    form.type === 'INTERNSHIP'
                      ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/10 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      form.type === 'INTERNSHIP' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Clinical Internship</div>
                    <div className="text-xs text-slate-500 mt-0.5">Hands-on hospital or center training for students & interns</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: 'JOB' }))}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    form.type === 'JOB'
                      ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/10 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      form.type === 'JOB' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Full-Time Career</div>
                    <div className="text-xs text-slate-500 mt-0.5">Permanent Ayush practitioner, research, or manufacturing role</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Location & Stipend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all ${
                      errors.location ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200' : 'border-slate-200'
                    }`}
                    value={form.location}
                    onChange={set('location')}
                    placeholder="e.g. New Delhi / Haridwar / Hybrid"
                  />
                </div>
                {errors.location && (
                  <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.location}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Stipend / Annual CTC
                </label>
                <div className="relative">
                  <Banknote className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                    value={form.stipend}
                    onChange={set('stipend')}
                    placeholder="e.g. ₹25,000/month or ₹6.5 LPA"
                  />
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Application Deadline <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all ${
                    errors.deadline ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200' : 'border-slate-200'
                  }`}
                  value={form.deadline}
                  onChange={set('deadline')}
                />
              </div>
              {errors.deadline && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.deadline}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Role Description & Requirements <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-4 top-4 pointer-events-none" />
                <textarea
                  rows={5}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all resize-none ${
                    errors.description ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200' : 'border-slate-200'
                  }`}
                  value={form.description}
                  onChange={set('description')}
                  placeholder="Detail the clinical responsibilities, patient interaction protocols, research participation, or facility requirements for this position..."
                />
              </div>
              {errors.description && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Skill Requirements Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-base">
                    Required Ayush Taxonomy Competencies
                  </h3>
                  <p className="text-xs text-slate-400">
                    Candidates will be automatically ranked based on overlap with these skills
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {selectedSkillIds.length} Selected
                </span>
                {selectedSkillIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSkillIds([])}
                    className="text-xs font-semibold text-rose-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                )}
              </div>
            </div>

            {errors.skills && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errors.skills}</span>
              </div>
            )}

            {/* Selected preview chips */}
            {selectedSkillsObjects.length > 0 && (
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2.5 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Configured Match Criteria ({selectedSkillsObjects.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSkillsObjects.map((skill) => (
                    <SkillTag
                      key={skill.id}
                      name={skill.name}
                      system={skill.system}
                      onRemove={() => toggleSkill(skill.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Skill search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Search across 44 Ayush competencies (e.g. Nadi Pariksha, Panchkarma, Asana, Ilaj-bit-Tadbeer)..."
              />
            </div>

            {/* Skill selection categories */}
            <div className="space-y-5 pt-2">
              {SYSTEM_ORDER.map((system) => {
                const rawSkills = allSkills[system] || []
                const filteredSkills = rawSkills.filter(
                  (s) =>
                    !skillSearch ||
                    s.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
                    s.system.toLowerCase().includes(skillSearch.toLowerCase())
                )

                if (filteredSkills.length === 0) return null

                return (
                  <div key={system} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-emerald-700" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {system}
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {filteredSkills.filter((s) => selectedSkillIds.includes(s.id)).length} / {filteredSkills.length} selected
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {filteredSkills.map((skill) => {
                        const isSelected = selectedSkillIds.includes(skill.id)
                        return (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => toggleSkill(skill.id)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 active:scale-95 ${
                              isSelected
                                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/30'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                            <span>{skill.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <Link
              to="/company/dashboard"
              className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel and Return
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full sm:w-auto py-3.5 px-8 text-sm font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/25 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Opportunity...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Publish Opportunity & Activate Matching</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
