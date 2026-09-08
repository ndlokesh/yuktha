import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  User,
  Building2,
  GraduationCap,
  Award,
  Save,
  FileText,
  Briefcase,
  BookOpen,
} from 'lucide-react'

export default function FacultyProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await api.get('/faculty/profile')
      setProfile(res.data)
      setForm(res.data)
    } catch (err) {
      console.error('Fetch faculty profile error:', err)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/faculty/profile', form)
      toast.success('Faculty profile updated successfully!')
      fetchProfile()
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs text-slate-400">Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Academician & Faculty Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Maintain your research publications, consulting focus, and institutional credentials.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold text-2xl">
              {profile?.user?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{profile?.user?.name}</h2>
              <div className="text-xs text-slate-400">{profile?.user?.email}</div>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Verified Faculty
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Institution</label>
              <input
                type="text"
                value={form.institution || ''}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <input
                type="text"
                value={form.department || ''}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
              <input
                type="text"
                value={form.designation || ''}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Qualifications</label>
              <input
                type="text"
                value={form.qualifications || ''}
                onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Experience</label>
              <input
                type="number"
                value={form.experienceYears || 0}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Research Publications Count</label>
              <input
                type="number"
                value={form.publicationsCount || 0}
                onChange={(e) => setForm({ ...form, publicationsCount: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Specializations</label>
            <input
              type="text"
              value={form.specializations || ''}
              onChange={(e) => setForm({ ...form, specializations: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Research Interests & Focus</label>
            <input
              type="text"
              value={form.researchInterests || ''}
              onChange={(e) => setForm({ ...form, researchInterests: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Consulting Domains</label>
            <input
              type="text"
              value={form.consultingDomains || ''}
              onChange={(e) => setForm({ ...form, consultingDomains: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Profile Summary</label>
            <textarea
              rows={4}
              value={form.bio || ''}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                value={form.linkedinUrl || ''}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">CV / Resume Link</label>
              <input
                type="url"
                value={form.cvUrl || ''}
                onChange={(e) => setForm({ ...form, cvUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/40 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
