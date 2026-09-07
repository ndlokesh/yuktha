import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import { SkillTag } from '../../components/Badges'
import { CardSkeleton } from '../../components/Skeletons'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  User,
  Building2,
  GraduationCap,
  MapPin,
  Calendar,
  Award,
  FileText,
  UploadCloud,
  Check,
  Save,
  Search,
  Sparkles,
  ExternalLink,
  Tag,
  ShieldCheck,
} from 'lucide-react'

const SYSTEM_ORDER = [
  'Ayurveda',
  'Yoga & Naturopathy',
  'Unani',
  'Siddha',
  'Homeopathy',
  'Research & Clinical',
]

export default function StudentProfile() {
  const { user, reload } = useAuth()
  const [profile, setProfile] = useState(null)
  const [allSkills, setAllSkills] = useState({})
  const [selectedSkillIds, setSelectedSkillIds] = useState([])
  const [skillSearch, setSkillSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [form, setForm] = useState({})
  const resumeRef = useRef()

  const fetchData = async () => {
    try {
      const [profileRes, skillsRes] = await Promise.all([
        api.get('/student/profile'),
        api.get('/skills'),
      ])
      const p = profileRes.data
      setProfile(p)
      setAllSkills(skillsRes.data.grouped)
      setSelectedSkillIds(p.skills.map((s) => s.skillId))
      setForm({
        name: p.user.name,
        institution: p.institution,
        degree: p.degree,
        graduationYear: p.graduationYear,
        city: p.city,
        state: p.state,
        linkedinUrl: p.linkedinUrl || '',
        bio: p.bio || '',
        achievements: p.achievements || '',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const toggleSkill = (id) => {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/student/profile', form)
      await api.post('/student/skills', { skillIds: selectedSkillIds })
      await reload()
      toast.success('Ayush profile and competencies updated successfully!')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('resume', file)
    setUploadingResume(true)
    try {
      await api.post('/student/resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Resume uploaded successfully!')
      fetchData()
    } catch {
      toast.error('Resume upload failed')
    } finally {
      setUploadingResume(false)
      resumeRef.current.value = ''
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <CardSkeleton key={i} />
              ))}
          </div>
        </main>
      </div>
    )

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Ayush Practitioner Profile</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Curriculum & Skill Mapping
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Keep your Ayush taxonomy competencies up to date to maximize match scores
          </p>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Avatar, Resume, Links */}
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-emerald-800 to-teal-900 rounded-3xl flex items-center justify-center text-2xl text-white font-extrabold shadow-lg shadow-emerald-900/20">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-xs border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                <h2 className="font-bold text-base text-slate-900">{user?.name}</h2>
                <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                  {profile?.degree} · Batch of {profile?.graduationYear}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{profile?.institution}</p>

                {/* Resume Upload Box */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <input
                    type="file"
                    ref={resumeRef}
                    accept=".pdf"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />

                  {profile?.resumeUrl ? (
                    <div className="space-y-2">
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary btn-sm w-full justify-center text-xs font-bold py-2.5 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-emerald-700" />
                        <span>View Current Resume</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                      <button
                        type="button"
                        onClick={() => resumeRef.current?.click()}
                        className="btn-ghost btn-sm w-full justify-center text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Replace PDF File
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => resumeRef.current?.click()}
                      disabled={uploadingResume}
                      className="btn-accent btn-sm w-full justify-center py-2.5 text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{uploadingResume ? 'Uploading...' : 'Upload Resume (PDF)'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* LinkedIn & Social */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <span>Professional Network</span>
                </div>
                <input
                  className="input text-xs"
                  placeholder="https://linkedin.com/in/username"
                  value={form.linkedinUrl}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Right Column: Information & Skill Selection */}
            <div className="lg:col-span-2 space-y-5">
              {/* Basic Academic Info */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <User className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-bold text-sm text-slate-900">Academic & Personal Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Legal Name</label>
                    <input
                      className="input"
                      value={form.name || ''}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Degree / Qualification</label>
                    <input
                      className="input"
                      value={form.degree || ''}
                      onChange={(e) => setForm({ ...form, degree: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">College / Academic Institution</label>
                  <input
                    className="input"
                    value={form.institution || ''}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="label">Grad. Year</label>
                    <input
                      className="input"
                      type="number"
                      value={form.graduationYear || ''}
                      onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input
                      className="input"
                      value={form.city || ''}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input
                      className="input"
                      value={form.state || ''}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Clinical Bio & Career Objective</label>
                  <textarea
                    rows={3}
                    className="input resize-none"
                    placeholder="Brief statement about your clinical interests, Panchkarma training, or research aspirations..."
                    value={form.bio || ''}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Academic Honors & Publications</label>
                  <textarea
                    rows={2}
                    className="input resize-none"
                    placeholder="e.g. Winner of All-India Ayush Quiz 2024, Published paper in JAIM..."
                    value={form.achievements || ''}
                    onChange={(e) => setForm({ ...form, achievements: e.target.value })}
                  />
                </div>
              </div>

              {/* Ayush Skill Taxonomy Picker */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-bold text-sm text-slate-900">Ayush Skill Taxonomy</h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {selectedSkillIds.length} active
                    </span>
                  </div>

                  {/* Skill search filter */}
                  <div className="relative w-full sm:w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      className="input py-1.5 pl-8 text-xs rounded-lg"
                      placeholder="Filter skills..."
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {SYSTEM_ORDER.map((system) => {
                    const skills = (allSkills[system] || []).filter((sk) =>
                      sk.name.toLowerCase().includes(skillSearch.toLowerCase())
                    )
                    if (!skills.length) return null

                    return (
                      <div key={system}>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          {system}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((skill) => {
                            const selected = selectedSkillIds.includes(skill.id)
                            return (
                              <button
                                key={skill.id}
                                type="button"
                                onClick={() => toggleSkill(skill.id)}
                                className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                                  selected
                                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                                    : 'bg-slate-50/70 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                }`}
                              >
                                {selected && <Check className="w-3.5 h-3.5" />}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full py-3.5 text-base font-bold shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating Credentials...
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Complete Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
