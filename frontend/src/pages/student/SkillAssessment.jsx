import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/client'
import toast from 'react-hot-toast'
import {
  Sparkles,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Briefcase,
  Layers,
  ChevronRight,
  BarChart3,
  HelpCircle,
} from 'lucide-react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts'

export default function SkillAssessment() {
  const [assessments, setAssessments] = useState([])
  const [activeTest, setActiveTest] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [history, setHistory] = useState([])
  const [viewMode, setViewMode] = useState('catalog') // catalog | taking | result | history

  // Fetch assessments catalog and student history
  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const [assRes, histRes] = await Promise.all([
        api.get('/assessments'),
        api.get('/assessments/student/history'),
      ])
      setAssessments(assRes.data)
      setHistory(histRes.data)
      if (histRes.data.length > 0 && !evaluationResult) {
        // Provide latest result view if available
        setEvaluationResult(histRes.data[0])
      }
    } catch (err) {
      console.error('Failed to load assessment data:', err)
      toast.error('Failed to load assessments')
    } finally {
      setLoading(false)
    }
  }

  // Timer countdown
  useEffect(() => {
    if (viewMode !== 'taking' || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [viewMode, timeLeft])

  const handleStartTest = async (assessmentId) => {
    try {
      const { data } = await api.get(`/assessments/${assessmentId}`)
      setActiveTest(data)
      setCurrentQuestionIndex(0)
      setAnswers({})
      setTimeLeft(data.durationMinutes * 60)
      setViewMode('taking')
    } catch (err) {
      console.error('Failed to start test:', err)
      toast.error('Unable to load test questions')
    }
  }

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex })
  }

  const handleSubmitTest = async () => {
    if (!activeTest) return
    setSubmitting(true)
    try {
      const { data } = await api.post(`/assessments/${activeTest.id}/submit`, { answers })
      setEvaluationResult(data)
      setViewMode('result')
      toast.success('Assessment evaluated successfully!')
      // Refresh history
      const histRes = await api.get('/assessments/student/history')
      setHistory(histRes.data)
    } catch (err) {
      console.error('Submission error:', err)
      toast.error('Failed to submit assessment')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const remSecs = secs % 60
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Industry Competency & Skill Gap Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Skill Assessment & Gap Analysis
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Complete standardized technical, soft-skill, and aptitude evaluations shared by industry leaders.
              Yuktha computes your real-time competency spider chart, detects skill gaps against industry benchmarks,
              and maps customized career opportunities.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setViewMode('catalog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'catalog' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Assessments Catalog
            </button>
            {evaluationResult && (
              <button
                onClick={() => setViewMode('result')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'result' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Latest Gap Analysis
              </button>
            )}
            <button
              onClick={() => setViewMode('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'history' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Attempt History ({history.length})
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-slate-400">Loading skill assessments...</div>
          </div>
        ) : (
          <>
            {/* VIEW: CATALOG */}
            {viewMode === 'catalog' && (
              <div className="mt-8 space-y-8">
                {/* Intro Stats Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-400">Industry Alignment</div>
                        <div className="text-lg font-bold text-white">ICH-GCP & AYUSH Norms</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Questions curated with industry partners covering clinical protocols, data analytics, and regulatory safety.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-400">Competency Profiling</div>
                        <div className="text-lg font-bold text-white">Radar Gap Mapping</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Visualizes your strengths vs 75% industry baseline and tags verified skills directly onto your digital portfolio.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-400">Placement Multiplier</div>
                        <div className="text-lg font-bold text-white">Verified Skill Badges</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Recruiters prioritize applicants with passed assessments, boosting shortlisting rates by 3.4x.
                    </p>
                  </div>
                </div>

                {/* Assessments Grid */}
                <div>
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Available Skill Questionnaires & Aptitude Tests</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {assessments.map((a) => (
                      <div
                        key={a.id}
                        className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/30 transition-all group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase border ${
                                a.category === 'TECHNICAL'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : a.category === 'SOFT_SKILL'
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {a.category.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {a.durationMinutes} mins
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {a.title}
                          </h3>
                          <div className="text-xs text-emerald-400/80 font-medium mt-1">
                            Domain: {a.domain}
                          </div>
                          <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-3">
                            {a.description}
                          </p>

                          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5 text-xs text-slate-300">
                            <div>
                              <span className="text-slate-400">Questions:</span> {a.totalQuestions}
                            </div>
                            <div>
                              <span className="text-slate-400">Passing:</span> {a.passingScore}%
                            </div>
                          </div>

                          {a.lastAttempt && (
                            <div className="mt-3 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center justify-between">
                              <span className="text-slate-400">Previous Score:</span>
                              <span
                                className={`font-bold ${
                                  a.lastAttempt.percentage >= a.passingScore
                                    ? 'text-emerald-400'
                                    : 'text-amber-400'
                                }`}
                              >
                                {a.lastAttempt.percentage}%{' '}
                                {a.lastAttempt.percentage >= a.passingScore ? '(Passed)' : '(Retake advised)'}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleStartTest(a.id)}
                          className="mt-6 w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span>{a.lastAttempt ? 'Retake Assessment' : 'Start Assessment'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: TAKING TEST */}
            {viewMode === 'taking' && activeTest && (
              <div className="mt-8 max-w-3xl mx-auto">
                {/* Test Progress & Timer Header */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      {activeTest.category} Assessment
                    </span>
                    <h2 className="text-lg font-bold text-white">{activeTest.title}</h2>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Question {currentQuestionIndex + 1} of {activeTest.totalQuestions}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-sm font-bold">
                      <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>{formatTime(timeLeft)}</span>
                    </div>

                    <button
                      onClick={handleSubmitTest}
                      disabled={submitting}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? 'Evaluating...' : 'Submit Test'}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / activeTest.totalQuestions) * 100}%`,
                    }}
                  />
                </div>

                {/* Current Question Card */}
                {(() => {
                  const q = activeTest.questions[currentQuestionIndex]
                  if (!q) return null
                  const selected = answers[q.id]

                  return (
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
                          {q.skillName}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            q.difficulty === 'EASY'
                              ? 'text-emerald-400 bg-emerald-400/10'
                              : q.difficulty === 'HARD'
                              ? 'text-red-400 bg-red-400/10'
                              : 'text-amber-400 bg-amber-400/10'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                        {q.questionText}
                      </h3>

                      {/* Options */}
                      <div className="space-y-3 pt-2">
                        {q.options.map((opt, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectOption(q.id, idx)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                              selected === idx
                                ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950/50'
                                : 'bg-slate-950/50 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                                selected === idx
                                  ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                                  : 'border-slate-600'
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                          </div>
                        ))}
                      </div>

                      {/* Navigation Controls */}
                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <button
                          onClick={() => setCurrentQuestionIndex((p) => Math.max(0, p - 1))}
                          disabled={currentQuestionIndex === 0}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-40 transition-all cursor-pointer"
                        >
                          Previous
                        </button>

                        <div className="flex items-center gap-1.5">
                          {activeTest.questions.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentQuestionIndex(i)}
                              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                currentQuestionIndex === i
                                  ? 'bg-emerald-600 text-white'
                                  : answers[activeTest.questions[i].id] !== undefined
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>

                        {currentQuestionIndex < activeTest.totalQuestions - 1 ? (
                          <button
                            onClick={() => setCurrentQuestionIndex((p) => p + 1)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitTest}
                            disabled={submitting}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer"
                          >
                            Finish & Review
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* VIEW: RESULT & RADAR GAP ANALYSIS */}
            {viewMode === 'result' && evaluationResult && (
              <div className="mt-8 space-y-8">
                {/* Result Hero Banner */}
                <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Evaluation Completed</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                        Your Skill Profile & Competency Breakdown
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                        Based on industry standard benchmarks (75%), here is an analysis of your technical and soft skill proficiency,
                        highlighting your key strengths and specific development opportunities.
                      </p>
                    </div>

                    <div className="bg-slate-950/70 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[160px]">
                      <div className="text-xs text-slate-400 uppercase font-semibold">Overall Score</div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1">
                        {evaluationResult.percentage}%
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 font-medium">
                        {evaluationResult.score} / {evaluationResult.totalQuestions} Correct
                      </div>
                    </div>
                  </div>
                </div>

                {/* Radar Chart + Strengths & Gaps Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Radar Chart (7 cols) */}
                  <div className="lg:col-span-7 bg-slate-900/90 border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-emerald-400" />
                          <span>Competency Radar vs. Industry Benchmark</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Green denotes your assessed competence; Amber line marks expected industry baseline (75%).
                        </p>
                      </div>
                    </div>

                    <div className="h-[340px] w-full pt-4">
                      {evaluationResult.categoryBreakdown && evaluationResult.categoryBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={evaluationResult.categoryBreakdown}>
                            <PolarGrid stroke="#334155" />
                            <PolarAngleAxis
                              dataKey="category"
                              stroke="#94a3b8"
                              tick={{ fill: '#cbd5e1', fontSize: 11 }}
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                            <Radar
                              name="Your Score (%)"
                              dataKey="score"
                              stroke="#10b981"
                              fill="#10b981"
                              fillOpacity={0.4}
                            />
                            <Radar
                              name="Industry Benchmark (75%)"
                              dataKey="benchmark"
                              stroke="#f59e0b"
                              fill="#f59e0b"
                              fillOpacity={0.15}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#0f172a',
                                borderColor: '#334155',
                                borderRadius: '12px',
                                fontSize: '12px',
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-slate-500">
                          No category breakdown data available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Strengths & Gaps (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Strengths Card */}
                    <div className="bg-slate-900/90 border border-emerald-500/20 rounded-3xl p-6 shadow-xl">
                      <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Identified Strengths</span>
                      </h4>
                      <ul className="space-y-2.5">
                        {evaluationResult.strengths?.map((str, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-200 flex items-start gap-2 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/10 leading-relaxed"
                          >
                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skill Gaps Card */}
                    <div className="bg-slate-900/90 border border-amber-500/20 rounded-3xl p-6 shadow-xl">
                      <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Identified Skill Gaps (Action Required)</span>
                      </h4>
                      <ul className="space-y-2.5">
                        {evaluationResult.skillGaps?.map((gap, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-200 flex items-start gap-2 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/10 leading-relaxed"
                          >
                            <span className="text-amber-400 font-bold shrink-0">!</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Skill Mapping & Recommended Career Pathways */}
                <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    <span>Skill Mapping & Recommended Career Paths</span>
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Based on your demonstrated competencies, the system has identified the most aligned industry job roles and targeted training programs.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evaluationResult.recommendations?.map((rec, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-sm font-bold text-white">{rec.role}</span>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {rec.matchPercent}% Match
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            Estimated Market CTC: <span className="text-slate-200 font-semibold">{rec.salaryRange}</span>
                          </div>

                          <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
                            <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mb-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Recommended Skill Course:</span>
                            </div>
                            <div className="text-slate-300">{rec.suggestedProgram}</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">Industry demand: High</span>
                          <button
                            onClick={() => (window.location.href = '/student/learning')}
                            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Enroll in Program</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Questions & Explanations */}
                {evaluationResult.review && (
                  <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-400" />
                      <span>Detailed Answer Review & Learning Explanations</span>
                    </h3>

                    <div className="space-y-4">
                      {evaluationResult.review.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                            item.isCorrect
                              ? 'bg-emerald-950/10 border-emerald-500/20'
                              : 'bg-red-950/10 border-red-500/20'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5 font-semibold">
                            <span className="text-slate-200">
                              Q{idx + 1}. {item.questionText}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                item.isCorrect
                              ? 'text-emerald-400 bg-emerald-400/10'
                              : 'text-red-400 bg-red-400/10'
                              }`}
                            >
                              {item.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                            </span>
                          </div>

                          <div className="mt-2 space-y-1 pl-2 border-l-2 border-white/10">
                            <div className="text-slate-400">
                              Your selection:{' '}
                              <span className={item.isCorrect ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                                {item.selectedAnswer !== null ? item.options[item.selectedAnswer] : 'None'}
                              </span>
                            </div>
                            {!item.isCorrect && (
                              <div className="text-emerald-400">
                                Correct answer: {item.options[item.correctAnswer]}
                              </div>
                            )}
                            {item.explanation && (
                              <div className="text-slate-300 bg-black/20 p-2 rounded-lg mt-2 text-[11px]">
                                <span className="font-semibold text-slate-400">Rationale:</span> {item.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW: ATTEMPTS HISTORY */}
            {viewMode === 'history' && (
              <div className="mt-8 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-400" />
                  <span>Previous Evaluation History</span>
                </h2>

                {history.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900 border border-white/10 rounded-2xl text-slate-400 text-xs">
                    No completed assessments yet. Take an assessment from the catalog to build your competency profile!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((h) => (
                      <div
                        key={h.id}
                        className="bg-slate-900 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-300 uppercase">
                              {h.category}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(h.completedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-white">{h.assessmentTitle}</h3>
                          <div className="text-xs text-slate-400 mt-1">Domain: {h.domain}</div>

                          <div className="mt-4 flex items-center gap-4">
                            <div>
                              <div className="text-[11px] text-slate-400">Score</div>
                              <div className="text-lg font-bold text-white">
                                {h.score} / {h.totalQuestions}
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] text-slate-400">Percentage</div>
                              <div
                                className={`text-lg font-bold ${
                                  h.passed ? 'text-emerald-400' : 'text-amber-400'
                                }`}
                              >
                                {h.percentage}%
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] text-slate-400">Result</div>
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  h.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                }`}
                              >
                                {h.passed ? 'Passed' : 'Needs Review'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setEvaluationResult(h)
                            setViewMode('result')
                          }}
                          className="mt-5 w-full py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>View Radar & Recommendations</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
