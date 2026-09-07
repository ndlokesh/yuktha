import { Sparkles, Briefcase, GraduationCap, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

const systemStyles = {
  'Ayurveda': 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/60',
  'Yoga & Naturopathy': 'bg-teal-50 text-teal-800 border-teal-200/80 hover:bg-teal-100/60',
  'Unani': 'bg-sky-50 text-sky-800 border-sky-200/80 hover:bg-sky-100/60',
  'Siddha': 'bg-purple-50 text-purple-800 border-purple-200/80 hover:bg-purple-100/60',
  'Homeopathy': 'bg-rose-50 text-rose-800 border-rose-200/80 hover:bg-rose-100/60',
  'Research & Clinical': 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100/60',
}

const systemDot = {
  'Ayurveda': 'bg-emerald-500',
  'Yoga & Naturopathy': 'bg-teal-500',
  'Unani': 'bg-sky-500',
  'Siddha': 'bg-purple-500',
  'Homeopathy': 'bg-rose-500',
  'Research & Clinical': 'bg-amber-500',
}

export function SkillTag({ name, system, onRemove, size = 'sm' }) {
  const style = systemStyles[system] || 'bg-slate-100 text-slate-800 border-slate-200'
  const dot = systemDot[system] || 'bg-slate-400'
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all ${
        size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${style} shadow-2xs`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 p-0.5 hover:bg-black/10 rounded text-slate-500 hover:text-slate-900 transition-colors"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    APPLIED: {
      cls: 'bg-blue-50 text-blue-700 border-blue-200/80',
      dot: 'bg-blue-500',
      label: 'Applied',
      icon: Clock,
    },
    SHORTLISTED: {
      cls: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500 animate-pulse',
      label: 'Shortlisted',
      icon: Sparkles,
    },
    ACCEPTED: {
      cls: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
      label: 'Accepted',
      icon: CheckCircle2,
    },
    REJECTED: {
      cls: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500',
      label: 'Not Selected',
      icon: AlertCircle,
    },
  }
  const config = map[status] || {
    cls: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    label: status,
    icon: Clock,
  }
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.cls} shadow-2xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3 h-3 opacity-70" />
      <span>{config.label}</span>
    </span>
  )
}

export function JobTypeBadge({ type }) {
  const isInternship = type === 'INTERNSHIP'
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-2xs ${
        isInternship
          ? 'bg-violet-50 text-violet-700 border-violet-200/80'
          : 'bg-teal-50 text-teal-800 border-teal-200/80'
      }`}
    >
      {isInternship ? (
        <>
          <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
          <span>Internship</span>
        </>
      ) : (
        <>
          <Briefcase className="w-3.5 h-3.5 text-teal-600" />
          <span>Full-time</span>
        </>
      )}
    </span>
  )
}

export function MatchScore({ percent }) {
  const isHigh = percent >= 75
  const isMed = percent >= 40

  const colorConfig = isHigh
    ? {
        bar: 'from-emerald-500 to-teal-500',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50 border-emerald-200/80',
      }
    : isMed
    ? {
        bar: 'from-amber-500 to-yellow-500',
        text: 'text-amber-700',
        bg: 'bg-amber-50 border-amber-200/80',
      }
    : {
        bar: 'from-slate-400 to-slate-500',
        text: 'text-slate-600',
        bg: 'bg-slate-100 border-slate-200',
      }

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl border ${colorConfig.bg} shadow-2xs`}>
      <Sparkles className={`w-3.5 h-3.5 ${colorConfig.text}`} />
      <div className="w-14 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorConfig.bar} transition-all duration-500`}
          style={{ width: `${Math.max(8, percent)}%` }}
        />
      </div>
      <span className={`text-xs font-bold font-display ${colorConfig.text}`}>
        {percent}%
      </span>
    </div>
  )
}
