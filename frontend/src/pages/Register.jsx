import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const DEGREES = ['BAMS', 'BHMS', 'BUMS', 'BNYS', 'B.Sc Yoga', 'BSMS', 'MD (Ayurveda)', 'MD (Homeopathy)', 'PhD', 'Other']

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') || 'STUDENT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    institution: '', degree: 'BAMS', graduationYear: new Date().getFullYear() + 1,
    city: '', state: '',
    companyName: '', sector: '',
    collegeName: '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      const data = await register({ ...form, role })
      if (role === 'STUDENT' && !data.user?.isActive) {
        toast.success('Registered! Your account is pending verification by your institution.')
        navigate('/login')
      } else {
        toast.success('Registered successfully!')
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayush-dark to-ayush-primary flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6">← Back to home</Link>
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="font-display font-bold text-2xl text-white">Create Your Account</h1>
          <p className="text-white/60 text-sm mt-2">Join India's Ayush placement network</p>
        </div>

        <div className="card">
          {/* Role picker */}
          <div className="mb-6">
            <label className="label">I am registering as</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'STUDENT', icon: '🎓', label: 'Student' },
                { value: 'COMPANY', icon: '🏢', label: 'Company' },
                { value: 'COLLEGE', icon: '🏛️', label: 'College' },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    role === r.value
                      ? 'border-ayush-primary bg-ayush-light text-ayush-primary'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="text-xl mb-1">{r.icon}</div>
                  <div className="text-xs font-medium">{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input" required value={form.name} onChange={set('name')} placeholder="Dr. Priya Sharma" />
              </div>
              <div>
                <label className="label">Email *</label>
                <input className="input" type="email" required value={form.email} onChange={set('email')} placeholder="you@email.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Password *</label>
                <input className="input" type="password" required value={form.password} onChange={set('password')} placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="label">Confirm Password *</label>
                <input className="input" type="password" required value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" />
              </div>
            </div>

            {/* Student-specific */}
            {role === 'STUDENT' && (
              <>
                <div>
                  <label className="label">Institution / College *</label>
                  <input className="input" required value={form.institution} onChange={set('institution')} placeholder="e.g. Gujarat Ayurved University" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Degree *</label>
                    <select className="input" value={form.degree} onChange={set('degree')}>
                      {DEGREES.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Graduation Year *</label>
                    <input className="input" type="number" min="2020" max="2035" value={form.graduationYear} onChange={set('graduationYear')} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">City *</label>
                    <input className="input" required value={form.city} onChange={set('city')} placeholder="Jamnagar" />
                  </div>
                  <div>
                    <label className="label">State *</label>
                    <input className="input" required value={form.state} onChange={set('state')} placeholder="Gujarat" />
                  </div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  ℹ️ Your account will be activated after verification by your institution's college administrator.
                </div>
              </>
            )}

            {/* Company-specific */}
            {role === 'COMPANY' && (
              <>
                <div>
                  <label className="label">Company Name *</label>
                  <input className="input" required value={form.companyName} onChange={set('companyName')} placeholder="e.g. Himalaya Drug Company" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Sector *</label>
                    <input className="input" required value={form.sector} onChange={set('sector')} placeholder="e.g. Ayurveda Pharma, Wellness" />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input className="input" value={form.city} onChange={set('city')} placeholder="Bengaluru" />
                  </div>
                </div>
              </>
            )}

            {/* College-specific */}
            {role === 'COLLEGE' && (
              <>
                <div>
                  <label className="label">Institution Name *</label>
                  <input className="input" required value={form.collegeName} onChange={set('collegeName')} placeholder="e.g. NIA Jaipur" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">City *</label>
                    <input className="input" required value={form.city} onChange={set('city')} placeholder="Jaipur" />
                  </div>
                  <div>
                    <label className="label">State *</label>
                    <input className="input" required value={form.state} onChange={set('state')} placeholder="Rajasthan" />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ayush-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
