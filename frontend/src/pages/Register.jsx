import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import {
  GraduationCap,
  Building2,
  Landmark,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react'

const DEGREES = [
  'BAMS (Ayurveda)',
  'BHMS (Homeopathy)',
  'BUMS (Unani)',
  'BNYS (Naturopathy & Yoga)',
  'B.Sc Yoga',
  'BSMS (Siddha)',
  'MD (Ayurveda)',
  'MD (Homeopathy)',
  'PhD (Ayush Sciences)',
  'Diploma in Ayush Pharmacy',
  'Other',
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') || 'STUDENT')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    institution: '',
    degree: 'BAMS (Ayurveda)',
    graduationYear: new Date().getFullYear() + 1,
    city: '',
    state: '',
    companyName: '',
    sector: '',
    collegeName: '',
    website_hp: '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }

  const isPasswordStrong = (pwd) => {
    return pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /[0-9]/.test(pwd)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Spam/bot protection: honeypot check
    if (form.website_hp) {
      console.warn('Bot submission blocked.')
      return
    }

    if (!form.name.trim()) {
      setError('Full Name or Organization Name is required.')
      return
    }

    if (!isEmailValid(form.email)) {
      setError('Please provide a valid institutional or personal email address.')
      return
    }

    if (form.password !== form.confirm) {
      setError('Passwords do not match. Please verify both fields.')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long for security.')
      return
    }

    if (!isPasswordStrong(form.password)) {
      setError('Password must contain both letters and at least one number.')
      return
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms & Conditions and Privacy Policy to proceed.')
      return
    }

    setLoading(true)
    try {
      await register({ ...form, role })
      toast.success('Account created successfully! Welcome to Yuktha.')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    {
      value: 'STUDENT',
      icon: GraduationCap,
      title: 'Student / Scholar',
      desc: 'Browse jobs & verify skills',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      activeBorder: 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-md shadow-emerald-900/10',
    },
    {
      value: 'FACULTY',
      icon: Landmark,
      title: 'Academician / Faculty',
      desc: 'Internships, FDPs & research',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      activeBorder: 'border-cyan-600 bg-cyan-50/70 text-cyan-950 shadow-md shadow-cyan-900/10',
    },
    {
      value: 'COMPANY',
      icon: Building2,
      title: 'Industry / Company',
      desc: 'Post jobs & recruit talent',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      activeBorder: 'border-blue-600 bg-blue-50/70 text-blue-950 shadow-md shadow-blue-900/10',
    },
    {
      value: 'COLLEGE',
      icon: Landmark,
      title: 'Institution / College',
      desc: 'Verify & track placements',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      activeBorder: 'border-purple-600 bg-purple-50/70 text-purple-950 shadow-md shadow-purple-900/10',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tricolor top indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] z-50" />

      <div className="relative max-w-2xl mx-auto w-full">
        {/* Top Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-all mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Portal Home</span>
          </Link>

          {/* National Emblem & Badge */}
          <div className="flex justify-center mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ministry of Ayush · SIH26044 Portal</span>
            </div>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Create Your Official Account
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Join the national academia-industry skill mapping and placement ecosystem
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/40 border border-white/40">
          {/* Role selector segmented cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Select Account Type
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {role}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roleOptions.map((r) => {
                const Icon = r.icon
                const isSelected = role === r.value
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? r.activeBorder
                        : 'border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200/70 text-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-in fade-in" />
                      )}
                    </div>
                    <div className="font-bold text-sm leading-snug">{r.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{r.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              2. Enter Details
            </div>

            {/* Common fields: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    className="input pl-10"
                    required
                    value={form.name}
                    onChange={set('name')}
                    placeholder={role === 'STUDENT' ? 'Dr. Priya Sharma' : 'Officer Name'}
                  />
                </div>
              </div>
              <div>
                <label className="label text-slate-700">Official Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    className={`input pl-10 ${
                      emailTouched && form.email && !isEmailValid(form.email) ? 'input-error' : ''
                    }`}
                    type="email"
                    required
                    value={form.email}
                    onBlur={() => setEmailTouched(true)}
                    onChange={set('email')}
                    placeholder="name@domain.edu.in"
                    aria-invalid={emailTouched && form.email && !isEmailValid(form.email)}
                  />
                </div>
                {emailTouched && form.email && !isEmailValid(form.email) && (
                  <p className="text-[11px] text-red-600 mt-1">Please enter a valid email address.</p>
                )}
              </div>
            </div>

            {/* Honeypot anti-spam field */}
            <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <label htmlFor="reg_website_hp">Leave empty</label>
              <input
                id="reg_website_hp"
                type="text"
                tabIndex="-1"
                autoComplete="off"
                value={form.website_hp}
                onChange={(e) => setForm({ ...form, website_hp: e.target.value })}
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label text-slate-700">Password (Min 8 chars, letters &amp; numbers) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    className={`input pl-10 pr-10 ${
                      passwordTouched && form.password && !isPasswordStrong(form.password) ? 'input-error' : ''
                    }`}
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onBlur={() => setPasswordTouched(true)}
                    onChange={set('password')}
                    placeholder="At least 8 chars with number"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordTouched && form.password && !isPasswordStrong(form.password) && (
                  <p className="text-[11px] text-red-600 mt-1">Must be at least 8 chars with letters &amp; a number.</p>
                )}
              </div>
              <div>
                <label className="label text-slate-700">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    className={`input pl-10 ${
                      form.confirm && form.password !== form.confirm ? 'input-error' : ''
                    }`}
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.confirm}
                    onChange={set('confirm')}
                    placeholder="Re-enter password"
                  />
                </div>
                {form.confirm && form.password !== form.confirm && (
                  <p className="text-[11px] text-red-600 mt-1">Passwords do not match.</p>
                )}
              </div>
            </div>

            {/* Role-Specific Fields */}
            {role === 'STUDENT' && (
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div>
                  <label className="label">Ayush College / University *</label>
                  <div className="relative">
                    <Landmark className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      className="input pl-10"
                      required
                      value={form.institution}
                      onChange={set('institution')}
                      placeholder="e.g. Gujarat Ayurved University, Jamnagar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Degree / Stream *</label>
                    <div className="relative">
                      <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select className="input pl-10" value={form.degree} onChange={set('degree')}>
                        {DEGREES.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Graduation Year *</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        className="input pl-10"
                        type="number"
                        min="2020"
                        max="2035"
                        value={form.graduationYear}
                        onChange={set('graduationYear')}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">City *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        className="input pl-10"
                        required
                        value={form.city}
                        onChange={set('city')}
                        placeholder="Jamnagar"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">State *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        className="input pl-10"
                        required
                        value={form.state}
                        onChange={set('state')}
                        placeholder="Gujarat"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {role === 'FACULTY' && (
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div>
                  <label className="label">University / Institution *</label>
                  <div className="relative">
                    <Landmark className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      className="input pl-10"
                      required
                      value={form.institution}
                      onChange={set('institution')}
                      placeholder="e.g. Gujarat Ayurved University"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Department *</label>
                    <input
                      className="input"
                      required
                      value={form.department || ''}
                      onChange={set('department')}
                      placeholder="e.g. Clinical Pharmacology"
                    />
                  </div>
                  <div>
                    <label className="label">Designation *</label>
                    <input
                      className="input"
                      required
                      value={form.designation || ''}
                      onChange={set('designation')}
                      placeholder="e.g. Professor / Associate Professor"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Qualifications *</label>
                    <input
                      className="input"
                      required
                      value={form.qualifications || ''}
                      onChange={set('qualifications')}
                      placeholder="e.g. Ph.D, MD, MS"
                    />
                  </div>
                  <div>
                    <label className="label">Specialization Areas *</label>
                    <input
                      className="input"
                      required
                      value={form.specializations || ''}
                      onChange={set('specializations')}
                      placeholder="e.g. Phytopharmacy, Clinical Trials"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'COMPANY' && (
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div>
                  <label className="label">Company / Organization Name *</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      className="input pl-10"
                      required
                      value={form.companyName}
                      onChange={set('companyName')}
                      placeholder="e.g. Himalaya Wellness Company"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Sector / Domain *</label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        className="input pl-10"
                        required
                        value={form.sector}
                        onChange={set('sector')}
                        placeholder="e.g. Ayurveda Pharma, Wellness Resort, Clinical Trials"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Headquarters City *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        className="input pl-10"
                        required
                        value={form.city}
                        onChange={set('city')}
                        placeholder="Bengaluru"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {role === 'COLLEGE' && (
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div>
                  <label className="label">Institution / College Name *</label>
                  <div className="relative">
                    <Landmark className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      className="input pl-10"
                      required
                      value={form.collegeName}
                      onChange={set('collegeName')}
                      placeholder="e.g. National Institute of Ayurveda, Jaipur"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Campus City *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        className="input pl-10"
                        required
                        value={form.city}
                        onChange={set('city')}
                        placeholder="Jaipur"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">State *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        className="input pl-10"
                        required
                        value={form.state}
                        onChange={set('state')}
                        placeholder="Rajasthan"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl p-3.5 flex items-center gap-2">
                <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Terms and Privacy Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600 leading-normal">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-emerald-700 font-bold hover:underline">
                    Terms &amp; Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" target="_blank" className="text-emerald-700 font-bold hover:underline">
                    Privacy Policy
                  </Link>
                  {' '}governing verified Ayush academic and enterprise data governance.
                </span>
              </label>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base font-semibold shadow-lg shadow-emerald-950/25 hover:shadow-xl hover:shadow-emerald-950/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Securing Registration...
                </span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Card footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Already have an Ayush portal account?{' '}
              <Link to="/login" className="text-emerald-700 font-bold hover:underline">
                Sign In here
              </Link>
            </div>
            <div className="inline-flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted &amp; Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
