import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { SkillTag } from '../../components/Badges'
import api from '../../api/client'
import toast from 'react-hot-toast'

const SYSTEM_ORDER = ['Ayurveda', 'Yoga & Naturopathy', 'Unani', 'Siddha', 'Homeopathy', 'Research & Clinical']

export default function PostJob() {
  const navigate = useNavigate()
  const [allSkills, setAllSkills] = useState({})
  const [selectedSkillIds, setSelectedSkillIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', type: 'INTERNSHIP',
    location: '', stipend: '',
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    api.get('/skills').then(r => setAllSkills(r.data.grouped))
  }, [])

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.deadline) e.deadline = 'Deadline is required'
    if (selectedSkillIds.length === 0) e.skills = 'Select at least one skill'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const job = await api.post('/jobs', { ...form, skillIds: selectedSkillIds })
      toast.success('Job posted successfully!')
      navigate('/company/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  const toggleSkill = (id) => {
    setSelectedSkillIds(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id])
    setErrors(e => ({ ...e, skills: '' }))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="section-title">Post an Opportunity</h1>
          <p className="section-subtitle">Define required Ayush skills to match with the right candidates</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic details */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-ayush-dark border-b border-slate-100 pb-2">Opportunity Details</h3>
            <div>
              <label className="label">Job / Internship Title *</label>
              <input className={`input ${errors.title ? 'input-error' : ''}`} value={form.title} onChange={set('title')} placeholder="e.g. Panchkarma Therapist – Clinical Internship" />
              {errors.title && <p className="error-msg">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Type *</label>
                <select className="input" value={form.type} onChange={set('type')}>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="JOB">Full-time Job</option>
                </select>
              </div>
              <div>
                <label className="label">Location *</label>
                <input className={`input ${errors.location ? 'input-error' : ''}`} value={form.location} onChange={set('location')} placeholder="City, State or Remote" />
                {errors.location && <p className="error-msg">{errors.location}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Stipend / Salary</label>
                <input className="input" value={form.stipend} onChange={set('stipend')} placeholder="e.g. ₹15,000/month" />
              </div>
              <div>
                <label className="label">Application Deadline *</label>
                <input className={`input ${errors.deadline ? 'input-error' : ''}`} type="date" value={form.deadline} onChange={set('deadline')} />
                {errors.deadline && <p className="error-msg">{errors.deadline}</p>}
              </div>
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea rows={5} className={`input resize-none ${errors.description ? 'input-error' : ''}`} value={form.description} onChange={set('description')} placeholder="Describe the role, responsibilities, eligibility and what candidates will gain..." />
              {errors.description && <p className="error-msg">{errors.description}</p>}
            </div>
          </div>

          {/* Skill requirements */}
          <div className="card">
            <h3 className="font-semibold text-ayush-dark border-b border-slate-100 pb-2 mb-4">
              Required Ayush Skills *
              <span className="text-xs text-slate-400 font-normal ml-2">({selectedSkillIds.length} selected)</span>
            </h3>
            {errors.skills && <p className="error-msg mb-3">{errors.skills}</p>}

            {/* Selected preview */}
            {selectedSkillIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-ayush-light rounded-lg">
                {Object.values(allSkills).flat().filter(s => selectedSkillIds.includes(s.id)).map(skill => (
                  <SkillTag key={skill.id} name={skill.name} system={skill.system} onRemove={() => toggleSkill(skill.id)} />
                ))}
              </div>
            )}

            <div className="space-y-4">
              {SYSTEM_ORDER.map((system) => {
                const skills = allSkills[system] || []
                if (!skills.length) return null
                return (
                  <div key={system}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{system}</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => {
                        const sel = selectedSkillIds.includes(skill.id)
                        return (
                          <button key={skill.id} type="button" onClick={() => toggleSkill(skill.id)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${sel ? 'bg-ayush-primary text-white border-ayush-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-ayush-primary/50'}`}>
                            {sel && '✓ '}{skill.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
            {loading ? 'Posting...' : '🚀 Post Opportunity'}
          </button>
        </form>
      </main>
    </div>
  )
}
