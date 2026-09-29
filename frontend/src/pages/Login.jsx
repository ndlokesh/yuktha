import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { trackEvent } from '../utils/analytics'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Building2,
  Landmark,
  ShieldCheck,
  AlertCircle,
  Zap,
} from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '', website_hp: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })

  useEffect(() => {
    const demoRole = searchParams.get('demo')
    if (demoRole && ['student', 'faculty', 'company', 'college', 'admin'].includes(demoRole.toLowerCase())) {
      fillDemo(demoRole.toLowerCase())
    }
  }, [searchParams])

  // Email format validation
  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Spam/bot protection: check honeypot
    if (form.website_hp) {
      console.warn('Bot submission blocked.')
      return
    }

    if (!isEmailValid(form.email)) {
      setError('Please enter a valid academic or organizational email address.')
      return
    }

    if (!form.password) {
      setError('Password is required.')
      return
    }

    setLoading(true)
    trackEvent('Auth', 'Login Attempt', form.email.split('@')[1] || '')

    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      trackEvent('Auth', 'Login Success', user.role)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || 'Authentication failed. Please verify your credentials.'
      setError(msg)
      trackEvent('Auth', 'Login Failure', msg)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    const demos = {
      student: { email: 'student@ayushportal.demo', password: 'Demo@1234', website_hp: '' },
      faculty: { email: 'faculty@ayushportal.demo', password: 'Demo@1234', website_hp: '' },
      company: { email: 'company@ayushportal.demo', password: 'Demo@1234', website_hp: '' },
      college: { email: 'college@ayushportal.demo', password: 'Demo@1234', website_hp: '' },
      admin: { email: 'admin@ayushportal.demo', password: 'Demo@1234', website_hp: '' },
    }
    setForm(demos[role])
    trackEvent('Demo', 'Select Persona', role)
    toast.success(`Loaded ${role} credentials`)
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Tricolor top indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] z-50" />

      <div className="relative max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-all mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Portal Home</span>
          </Link>

          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/40">
              Y
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-white">Yuktha</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Academia–Industry Collaboration Portal</h1>
          <p className="text-xs text-slate-300 mt-1">Sign in to your verified institutional or corporate account</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 border border-white/40">
          {/* 1-Click Demo Logins */}
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>1-Click Demo Logins:</span>
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                Pre-seeded
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { key: 'student', label: 'Student', icon: GraduationCap },
                { key: 'faculty', label: 'Faculty', icon: Landmark },
                { key: 'company', label: 'Industry', icon: Building2 },
                { key: 'college', label: 'College', icon: Landmark },
                { key: 'admin', label: 'Admin', icon: ShieldCheck },
              ].map((d) => {
                const Icon = d.icon
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => fillDemo(d.key)}
                    className="flex flex-col items-center justify-center gap-1 py-2 px-0.5 rounded-xl bg-white hover:bg-emerald-700 hover:text-white text-slate-800 text-[11px] font-semibold border border-emerald-200 shadow-xs hover:shadow-sm hover:border-emerald-700 transition-all cursor-pointer group"
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-700 group-hover:text-white transition-colors" />
                    <span>{d.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Honeypot field (hidden from genuine users, traps bots) */}
            <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <label htmlFor="website_hp">Leave empty</label>
              <input
                id="website_hp"
                type="text"
                tabIndex="-1"
                autoComplete="off"
                value={form.website_hp}
                onChange={(e) => setForm({ ...form, website_hp: e.target.value })}
              />
            </div>

            <div>
              <label className="label text-slate-700">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`input pl-10 ${
                    touched.email && form.email && !isEmailValid(form.email) ? 'input-error' : ''
                  }`}
                  placeholder="name@ayushportal.demo"
                  aria-invalid={touched.email && form.email && !isEmailValid(form.email)}
                />
              </div>
              {touched.email && form.email && !isEmailValid(form.email) && (
                <p className="text-[11px] text-red-600 mt-1">Please enter a valid email address (e.g., student@domain.edu)</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0 text-slate-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl p-3.5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base font-semibold shadow-lg shadow-emerald-950/25 hover:shadow-xl hover:shadow-emerald-950/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Legal Consent & Registration Links */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div>
                New to Ayush Portal?{' '}
                <Link to="/register" className="text-emerald-700 font-bold hover:underline">
                  Register Free
                </Link>
              </div>
              <div className="inline-flex items-center gap-1 text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>SSL 256-bit</span>
              </div>
            </div>

            <div className="text-[11px] text-center text-slate-600 pt-1">
              By signing in, you accept our{' '}
              <Link to="/terms" className="text-emerald-700 hover:underline font-medium">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-emerald-700 hover:underline font-medium">Privacy Policy</Link>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
