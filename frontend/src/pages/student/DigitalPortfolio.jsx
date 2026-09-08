import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  FolderGit2,
  ShieldCheck,
  Award,
  ExternalLink,
  Globe,
  Share2,
  Plus,
  Trash2,
  FileText,
  Building2,
  Briefcase,
  GraduationCap,
  Star,
  CheckCircle2,
  Download,
  Sparkles,
} from 'lucide-react'

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export default function DigitalPortfolio() {
  const { user } = useAuth()
  const { studentId: routeStudentId } = useParams()
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddCert, setShowAddCert] = useState(false)
  const [showAddDoc, setShowAddDoc] = useState(false)

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    techStack: '',
    repoUrl: '',
    liveUrl: '',
    role: 'Lead Contributor',
  })

  // Certification form state
  const [certForm, setCertForm] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
  })

  // Document form state
  const [docForm, setDocForm] = useState({
    title: '',
    type: 'RESUME',
    fileUrl: '',
    fileSize: '1.2 MB',
  })

  const targetId = routeStudentId || user?.student?.id || user?.id

  useEffect(() => {
    if (targetId) {
      fetchPortfolio(targetId)
    }
  }, [targetId])

  const fetchPortfolio = async (id) => {
    setLoading(true)
    try {
      const { data } = await api.get(`/portfolio/${id}`)
      setPortfolio(data)
    } catch (err) {
      console.error('Failed to load portfolio:', err)
      toast.error('Failed to load portfolio')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/portfolio/${portfolio?.id}`
    navigator.clipboard.writeText(url)
    toast.success('Shareable portfolio link copied to clipboard!')
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      await api.post('/portfolio/projects', projectForm)
      toast.success('Project added to portfolio!')
      setShowAddProject(false)
      setProjectForm({ title: '', description: '', techStack: '', repoUrl: '', liveUrl: '', role: 'Lead Contributor' })
      fetchPortfolio(targetId)
    } catch {
      toast.error('Failed to add project')
    }
  }

  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/portfolio/projects/${id}`)
      toast.success('Project deleted')
      fetchPortfolio(targetId)
    } catch {
      toast.error('Failed to delete project')
    }
  }

  const handleCreateCert = async (e) => {
    e.preventDefault()
    try {
      await api.post('/portfolio/certifications', certForm)
      toast.success('Certification added!')
      setShowAddCert(false)
      setCertForm({ title: '', issuer: '', issueDate: '', credentialUrl: '' })
      fetchPortfolio(targetId)
    } catch {
      toast.error('Failed to add certification')
    }
  }

  const handleAddDoc = async (e) => {
    e.preventDefault()
    try {
      await api.post('/portfolio/documents', docForm)
      toast.success('Document uploaded to repository!')
      setShowAddDoc(false)
      setDocForm({ title: '', type: 'RESUME', fileUrl: '', fileSize: '1.2 MB' })
      fetchPortfolio(targetId)
    } catch {
      toast.error('Failed to register document')
    }
  }

  const handleDeleteDoc = async (id) => {
    try {
      await api.delete(`/portfolio/documents/${id}`)
      toast.success('Document removed')
      fetchPortfolio(targetId)
    } catch {
      toast.error('Failed to delete document')
    }
  }

  const isOwner = user?.role === 'STUDENT' && (user?.student?.id === portfolio?.id || user?.id === portfolio?.id)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs text-slate-400">Loading digital portfolio...</div>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          Portfolio not found or private.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Digital Portfolio Header Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-[2px] shadow-lg shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-display font-extrabold text-2xl text-emerald-400">
                  {portfolio.name?.charAt(0)}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">{portfolio.name}</h1>
                  {portfolio.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Student Portfolio</span>
                    </span>
                  )}
                </div>

                <div className="text-sm font-semibold text-emerald-400 mb-2">
                  {portfolio.targetRole || 'Clinical Research & Healthcare Specialist'}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-300" />
                    {portfolio.degree} ({portfolio.graduationYear})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-300" />
                    {portfolio.institution}
                  </span>
                  {portfolio.cgpa && (
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-200 font-semibold">
                      CGPA: {portfolio.cgpa} / 10
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyShareLink}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share Portfolio</span>
              </button>

              {portfolio.linkedinUrl && (
                <a
                  href={portfolio.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4 text-blue-400" />
                </a>
              )}
              {portfolio.githubUrl && (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                  title="GitHub Projects"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {portfolio.portfolioUrl && (
                <a
                  href={portfolio.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                  title="Personal Site"
                >
                  <Globe className="w-4 h-4 text-emerald-400" />
                </a>
              )}
            </div>
          </div>

          {portfolio.bio && (
            <div className="mt-6 pt-6 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
              {portfolio.bio}
            </div>
          )}
        </div>

        {/* Verified Skills & Competency Badges */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Verified Skills & Competency Taxonomy</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated against academic curriculum and validated through industry assessments.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">{portfolio.skills.length} Verified Skills</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {portfolio.skills.map((s) => (
              <div
                key={s.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/30 text-emerald-300 border border-emerald-500/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{s.name}</span>
                <span className="text-[10px] text-emerald-400/60 ml-1">({s.system})</span>
              </div>
            ))}
          </div>

          {portfolio.assessments?.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Standardized Assessment Credentials
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {portfolio.assessments.map((att) => (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white line-clamp-1">{att.assessmentTitle}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Validated on Yuktha Engine</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {att.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Showcase Projects */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-emerald-400" />
                <span>Featured Projects & Research Studies</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Applied hands-on practical research, clinical studies, and software tools.
              </p>
            </div>

            {isOwner && (
              <button
                onClick={() => setShowAddProject(!showAddProject)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            )}
          </div>

          {/* Add Project Form Drawer/Modal */}
          {showAddProject && (
            <form onSubmit={handleCreateProject} className="p-5 rounded-2xl bg-slate-950/80 border border-white/15 mb-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Add New Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Project Title *"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Tech Stack / Methodology (e.g. Clinical Research, GCP, Python) *"
                  required
                  value={projectForm.techStack}
                  onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Your Role (e.g. Lead Student Investigator)"
                  value={projectForm.role}
                  onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                />
                <input
                  type="url"
                  placeholder="Repository / Code Link (Optional)"
                  value={projectForm.repoUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <textarea
                placeholder="Detailed description of problem, methodology, and outcome *"
                required
                rows={3}
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Save Project
                </button>
              </div>
            </form>
          )}

          {/* Project List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolio.projects.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white">{p.title}</h3>
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {p.role && <div className="text-[11px] text-emerald-400 font-medium mt-0.5">{p.role}</div>}
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{p.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {p.techStack.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Completed Internships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certifications Card */}
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Verified Certifications</span>
              </h2>

              {isOwner && (
                <button
                  onClick={() => setShowAddCert(!showAddCert)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Cert</span>
                </button>
              )}
            </div>

            {showAddCert && (
              <form onSubmit={handleCreateCert} className="p-4 rounded-xl bg-slate-950 border border-white/10 mb-4 space-y-3">
                <input
                  type="text"
                  placeholder="Certification Title *"
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Issuing Organization (e.g. NIH, NPvCC) *"
                  required
                  value={certForm.issuer}
                  onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    required
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300 outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Credential URL"
                    value={certForm.credentialUrl}
                    onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShowAddCert(false)} className="px-3 py-1 text-xs text-slate-400">
                    Cancel
                  </button>
                  <button type="submit" className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs">
                    Save
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3 flex-1">
              {portfolio.certifications.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{c.title}</span>
                    </h3>
                    <div className="text-[11px] text-slate-400 mt-1">Issued by: {c.issuer}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Date: {new Date(c.issueDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {c.credentialUrl && (
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Completed Internships & Mentor Feedback */}
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col">
            <div className="pb-4 border-b border-white/5 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Industry Internships & Mentor Feedback</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-world industry track record with milestone ratings and corporate evaluations.
              </p>
            </div>

            <div className="space-y-3 flex-1">
              {portfolio.internships?.length === 0 ? (
                <div className="text-xs text-slate-500 py-10 text-center">No completed internships logged yet.</div>
              ) : (
                portfolio.internships.map((int) => (
                  <div key={int.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-white">{int.title}</h3>
                        <div className="text-[11px] text-emerald-400 font-medium">{int.companyName} ({int.companyCity})</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {int.status}
                      </span>
                    </div>

                    {int.note && (
                      <div className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-white/5 italic">
                        "{int.note}"
                      </div>
                    )}

                    {int.milestones?.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Evaluated Milestones ({int.milestones.length})
                        </div>
                        {int.milestones.map((m) => (
                          <div key={m.id} className="p-2 rounded-lg bg-slate-950/40 border border-white/5 text-[11px] flex items-center justify-between">
                            <span className="text-slate-300">W{m.weekNumber}: {m.title}</span>
                            {m.mentorRating && (
                              <div className="flex items-center gap-0.5 text-amber-400 font-bold">
                                <span>{m.mentorRating}</span>
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Secure Document Repository */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Verified Academic & Placement Documents</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Secure repository for verified resumes, institutional transcripts, and internship completion reports.
              </p>
            </div>

            {isOwner && (
              <button
                onClick={() => setShowAddDoc(!showAddDoc)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </button>
            )}
          </div>

          {showAddDoc && (
            <form onSubmit={handleAddDoc} className="p-4 rounded-xl bg-slate-950 border border-white/10 mb-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Document Title (e.g. Official Transcript 2025) *"
                  required
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 outline-none"
                />
                <select
                  value={docForm.type}
                  onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300 outline-none"
                >
                  <option value="RESUME">Resume / CV</option>
                  <option value="CERTIFICATE">Professional Certificate</option>
                  <option value="INTERNSHIP_REPORT">Internship Report</option>
                  <option value="ACADEMIC_RECORD">Academic Record / Transcript</option>
                </select>
                <input
                  type="text"
                  placeholder="File URL / Path *"
                  required
                  value={docForm.fileUrl}
                  onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowAddDoc(false)} className="px-3 py-1 text-xs text-slate-400">
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs">
                  Save Document
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {portfolio.documents?.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{doc.title}</div>
                    <div className="text-[10px] text-slate-400">
                      {doc.type.replace('_', ' ')} · {doc.fileSize || '1.0 MB'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Download / View"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  {isOwner && (
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
