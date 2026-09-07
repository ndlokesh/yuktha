import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    const demos = {
      student: { email: 'student@ayushportal.demo', password: 'Demo@1234' },
      company: { email: 'company@ayushportal.demo', password: 'Demo@1234' },
      college: { email: 'college@ayushportal.demo', password: 'Demo@1234' },
    }
    setForm(demos[role])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayush-dark to-ayush-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6">
            ← Back to home
          </Link>
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="font-display font-bold text-2xl text-white">Sign In to Ayush Portal</h1>
          <p className="text-white/60 text-sm mt-2">Ministry of Ayush — Academia-Industry Platform</p>
        </div>

        <div className="card">
          {/* Demo quick-fill */}
          <div className="mb-6 p-3 bg-ayush-light rounded-lg border border-ayush-primary/20">
            <p className="text-xs font-medium text-ayush-primary mb-2">Quick demo login:</p>
            <div className="flex flex-wrap gap-2">
              {['student', 'company', 'college'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-ayush-primary/10 text-ayush-primary hover:bg-ayush-primary/20 transition-colors capitalize"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 text-base mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-ayush-primary font-medium hover:underline">
              Register free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
