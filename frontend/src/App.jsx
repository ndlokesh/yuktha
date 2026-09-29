import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PageLoading from './components/PageLoading'
import { usePageMeta } from './utils/usePageMeta'

// Lazy-loaded Public Pages
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsConditions = lazy(() => import('./pages/TermsConditions'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Lazy-loaded Student pages
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'))
const StudentProfile = lazy(() => import('./pages/student/Profile'))
const StudentJobs = lazy(() => import('./pages/student/Jobs'))
const StudentApplications = lazy(() => import('./pages/student/Applications'))
const SkillAssessment = lazy(() => import('./pages/student/SkillAssessment'))
const DigitalPortfolio = lazy(() => import('./pages/student/DigitalPortfolio'))
const LearningPrograms = lazy(() => import('./pages/student/LearningPrograms'))

// Lazy-loaded Faculty pages
const FacultyDashboard = lazy(() => import('./pages/faculty/Dashboard'))
const FacultyOpportunities = lazy(() => import('./pages/faculty/Opportunities'))
const FacultyProposals = lazy(() => import('./pages/faculty/Proposals'))
const FacultyProfile = lazy(() => import('./pages/faculty/Profile'))

// Lazy-loaded Company pages
const CompanyDashboard = lazy(() => import('./pages/company/Dashboard'))
const PostJob = lazy(() => import('./pages/company/PostJob'))
const PostProgram = lazy(() => import('./pages/company/PostProgram'))
const PostCollaboration = lazy(() => import('./pages/company/PostCollaboration'))
const Applicants = lazy(() => import('./pages/company/Applicants'))

// Lazy-loaded College pages
const CollegeDashboard = lazy(() => import('./pages/college/Dashboard'))
const CollegeStudents = lazy(() => import('./pages/college/Students'))

// Lazy-loaded Admin / Ministry
const Analytics = lazy(() => import('./pages/admin/Analytics'))

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoading />
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  switch (user.role) {
    case 'STUDENT':  return <Navigate to="/student/dashboard" replace />
    case 'FACULTY':  return <Navigate to="/faculty/dashboard" replace />
    case 'COMPANY':  return <Navigate to="/company/dashboard" replace />
    case 'COLLEGE':  return <Navigate to="/college/dashboard" replace />
    case 'ADMIN':    return <Navigate to="/admin/analytics" replace />
    default:         return <Navigate to="/login" replace />
  }
}

// Sub-component to bind metadata and analytics route tracker
function AppRoutes() {
  usePageMeta()

  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* Public & Informational */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/portfolio/:studentId" element={<DigitalPortfolio />} />
        <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/student/dashboard"    element={<ProtectedRoute roles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/assessment"   element={<ProtectedRoute roles={['STUDENT']}><SkillAssessment /></ProtectedRoute>} />
        <Route path="/student/portfolio"    element={<ProtectedRoute roles={['STUDENT']}><DigitalPortfolio /></ProtectedRoute>} />
        <Route path="/student/jobs"         element={<ProtectedRoute roles={['STUDENT']}><StudentJobs /></ProtectedRoute>} />
        <Route path="/student/learning"     element={<ProtectedRoute roles={['STUDENT', 'FACULTY']}><LearningPrograms /></ProtectedRoute>} />
        <Route path="/student/applications" element={<ProtectedRoute roles={['STUDENT']}><StudentApplications /></ProtectedRoute>} />
        <Route path="/student/profile"      element={<ProtectedRoute roles={['STUDENT']}><StudentProfile /></ProtectedRoute>} />

        {/* Faculty Routes */}
        <Route path="/faculty/dashboard"     element={<ProtectedRoute roles={['FACULTY']}><FacultyDashboard /></ProtectedRoute>} />
        <Route path="/faculty/opportunities" element={<ProtectedRoute roles={['FACULTY']}><FacultyOpportunities /></ProtectedRoute>} />
        <Route path="/faculty/proposals"     element={<ProtectedRoute roles={['FACULTY']}><FacultyProposals /></ProtectedRoute>} />
        <Route path="/faculty/learning"      element={<ProtectedRoute roles={['FACULTY']}><LearningPrograms /></ProtectedRoute>} />
        <Route path="/faculty/profile"       element={<ProtectedRoute roles={['FACULTY']}><FacultyProfile /></ProtectedRoute>} />

        {/* Company Routes */}
        <Route path="/company/dashboard"          element={<ProtectedRoute roles={['COMPANY']}><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/post-job"           element={<ProtectedRoute roles={['COMPANY']}><PostJob /></ProtectedRoute>} />
        <Route path="/company/post-program"       element={<ProtectedRoute roles={['COMPANY']}><PostProgram /></ProtectedRoute>} />
        <Route path="/company/post-collaboration" element={<ProtectedRoute roles={['COMPANY']}><PostCollaboration /></ProtectedRoute>} />
        <Route path="/company/applicants/:jobId"   element={<ProtectedRoute roles={['COMPANY']}><Applicants /></ProtectedRoute>} />

        {/* College Routes */}
        <Route path="/college/dashboard" element={<ProtectedRoute roles={['COLLEGE', 'ADMIN']}><CollegeDashboard /></ProtectedRoute>} />
        <Route path="/college/students"  element={<ProtectedRoute roles={['COLLEGE', 'ADMIN']}><CollegeStudents /></ProtectedRoute>} />

        {/* Admin / Analytics */}
        <Route path="/admin/analytics" element={<ProtectedRoute roles={['ADMIN', 'COLLEGE']}><Analytics /></ProtectedRoute>} />

        {/* Custom 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
