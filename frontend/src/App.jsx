import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

// Student pages
import StudentDashboard from './pages/student/Dashboard'
import StudentProfile from './pages/student/Profile'
import StudentJobs from './pages/student/Jobs'
import StudentApplications from './pages/student/Applications'

// Company pages
import CompanyDashboard from './pages/company/Dashboard'
import PostJob from './pages/company/PostJob'
import Applicants from './pages/company/Applicants'

// College pages
import CollegeDashboard from './pages/college/Dashboard'
import CollegeStudents from './pages/college/Students'

// Admin / Ministry
import Analytics from './pages/admin/Analytics'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-ayush-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  switch (user.role) {
    case 'STUDENT':  return <Navigate to="/student/dashboard" replace />
    case 'COMPANY':  return <Navigate to="/company/dashboard" replace />
    case 'COLLEGE':  return <Navigate to="/college/dashboard" replace />
    case 'ADMIN':    return <Navigate to="/admin/analytics" replace />
    default:         return <Navigate to="/login" replace />
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

          {/* Student */}
          <Route path="/student/dashboard"    element={<ProtectedRoute roles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/profile"      element={<ProtectedRoute roles={['STUDENT']}><StudentProfile /></ProtectedRoute>} />
          <Route path="/student/jobs"         element={<ProtectedRoute roles={['STUDENT']}><StudentJobs /></ProtectedRoute>} />
          <Route path="/student/applications" element={<ProtectedRoute roles={['STUDENT']}><StudentApplications /></ProtectedRoute>} />

          {/* Company */}
          <Route path="/company/dashboard"        element={<ProtectedRoute roles={['COMPANY']}><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/company/post-job"         element={<ProtectedRoute roles={['COMPANY']}><PostJob /></ProtectedRoute>} />
          <Route path="/company/applicants/:jobId" element={<ProtectedRoute roles={['COMPANY']}><Applicants /></ProtectedRoute>} />

          {/* College */}
          <Route path="/college/dashboard" element={<ProtectedRoute roles={['COLLEGE', 'ADMIN']}><CollegeDashboard /></ProtectedRoute>} />
          <Route path="/college/students"  element={<ProtectedRoute roles={['COLLEGE', 'ADMIN']}><CollegeStudents /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/analytics" element={<ProtectedRoute roles={['ADMIN', 'COLLEGE']}><Analytics /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
