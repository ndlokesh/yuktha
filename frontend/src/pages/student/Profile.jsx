import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import { SkillTag } from '../../components/Badges'
import { CardSkeleton } from '../../components/Skeletons'
import api from '../../api/client'
import toast from 'react-hot-toast'

const SYSTEM_ORDER = ['Ayurveda', 'Yoga & Naturopathy', 'Unani', 'Siddha', 'Homeopathy', 'Research & Clinical']

export default function StudentProfile() {
  const { user, reload } = useAuth()
  const [profile, setProfile] = useState(null)
  const [allSkills, setAllSkills] = useState({})
  const [selectedSkillIds, setSelectedSkillIds] = useState([])
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
      setSelectedSkillIds(p.skills.map(s => s.skillId))
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

  useEffect(() => { fetchData() }, [])

  const toggleSkill = (id) => {
    setSelectedSkillIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/student/profile', form)
      await api.post('/student/skills', { skillIds: selectedSkillIds })
      await reload()
      toast.success('Profile updated successfully!')
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
      await api.post('/student/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Resume uploaded!')
      fetchData()
    } catch {
      toast.error('Resume upload failed')
    } finally {
      setUploadingResume(false)
      resumeRef.current.value = ''
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </main>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="section-title">My Profile</h1>
          <p className="section-subtitle">Keep your Ayush profile complete to maximise placement opportunities</p>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left panel */}
            <div className="space-y-4">
              {/* Avatar & resume */}
              <div className="card text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-ayush-primary to-ayush-secondary rounded-full flex items-center justify-center text-3xl text-white font-bold mx-auto mb-3">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <h2 className="font-semibold text-ayush-dark">{user?.name}</h2>
                <p className="text-sm text-slate-500">{profile?.degree} · {profile?.graduationYear}</p>
                <p className="text-xs text-slate-400 mt-1">{profile?.institution}</p>

                <div className="mt-4">
                  <input type="file" ref={resumeRef} accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                  {profile?.resumeUrl ? (
                    <div className="space-y-2">
                      <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-secondary btn-sm w-full justify-center">
                        📄 View Resume
                      </a>
                      <button type="button" onClick={() => resumeRef.current?.click()} className="btn-ghost btn-sm w-full justify-center text-xs">
                        Replace Resume
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => resumeRef.current?.click()} className="btn-primary btn-sm w-full justify-center" disabled={uploadingResume}>
                      {uploadingResume ? 'Uploading...' : '⬆ Upload Resume (PDF)'}
                    </button>
                  )}
                </div>
              </div>

              {/* LinkedIn */}
              <div className="card">
                <label className="label">LinkedIn URL</label>
                <input
                  className="input text-sm"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedinUrl}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Main form */}
            <div className="lg:col-span-2 space-y-4">
              {/* Basic info */}
              <div className="card space-y-4">
                <h3 className="font-semibold text-ayush-dark border-b border-slate-100 pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input className="input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Degree</label>
                    <input className="input" value={form.degree || ''} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label">Institution</label>
                  <input className="input" value={form.institution || ''} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">Graduation Year</label>
                    <input className="input" type="number" value={form.graduationYear || ''} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input className="input" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input className="input" value={form.state || ''} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label">Bio</label>
                  <textarea rows={3} className="input resize-none" placeholder="Brief description of your expertise and career goals..." value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                </div>
                <div>
                  <label className="label">Achievements & Awards</label>
                  <textarea rows={2} className="input resize-none" placeholder="e.g. Best Paper Award – AIAPRM 2024, National Merit Scholarship..." value={form.achievements || ''} onChange={(e) => setForm({ ...form, achievements: e.target.value })} />
                </div>
              </div>

              {/* Skill taxonomy */}
              <div className="card">
                <h3 className="font-semibold text-ayush-dark border-b border-slate-100 pb-2 mb-4">
                  Ayush Skills <span className="text-xs text-slate-400 font-normal ml-1">({selectedSkillIds.length} selected)</span>
                </h3>
                <div className="space-y-5">
                  {SYSTEM_ORDER.map((system) => {
                    const skills = allSkills[system] || []
                    if (!skills.length) return null
                    return (
                      <div key={system}>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{system}</p>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => {
                            const selected = selectedSkillIds.includes(skill.id)
                            return (
                              <button
                                key={skill.id}
                                type="button"
                                onClick={() => toggleSkill(skill.id)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                  selected
                                    ? 'bg-ayush-primary text-white border-ayush-primary'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-ayush-primary/50'
                                }`}
                              >
                                {selected && '✓ '}{skill.name}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3 text-base">
                {saving ? 'Saving...' : '💾 Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
