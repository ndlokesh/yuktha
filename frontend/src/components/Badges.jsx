const systemColors = {
  'Ayurveda': 'skill-chip-ayurveda',
  'Yoga & Naturopathy': 'skill-chip-yoga',
  'Unani': 'skill-chip-unani',
  'Siddha': 'skill-chip-siddha',
  'Homeopathy': 'skill-chip-homeopathy',
  'Research & Clinical': 'skill-chip-research',
}

export function SkillTag({ name, system, onRemove }) {
  const colorClass = systemColors[system] || 'skill-chip'
  return (
    <span className={`skill-chip ${colorClass} gap-1`}>
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:text-red-600 transition-colors leading-none"
          aria-label={`Remove ${name}`}
        >
          ×
        </button>
      )}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    APPLIED:     { cls: 'badge-blue',  label: 'Applied' },
    SHORTLISTED: { cls: 'badge-amber', label: 'Shortlisted' },
    ACCEPTED:    { cls: 'badge-green', label: 'Accepted' },
    REJECTED:    { cls: 'badge-red',   label: 'Rejected' },
  }
  const { cls, label } = map[status] || { cls: 'badge-slate', label: status }
  return <span className={cls}>{label}</span>
}

export function JobTypeBadge({ type }) {
  return (
    <span className={`badge ${type === 'INTERNSHIP' ? 'bg-violet-100 text-violet-800' : 'bg-sky-100 text-sky-800'}`}>
      {type === 'INTERNSHIP' ? '🎓 Internship' : '💼 Full-time'}
    </span>
  )
}

export function MatchScore({ percent }) {
  const color = percent >= 75 ? 'text-green-600' : percent >= 40 ? 'text-amber-600' : 'text-red-500'
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${percent >= 75 ? 'bg-green-500' : percent >= 40 ? 'bg-amber-500' : 'bg-red-400'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className={`text-xs font-semibold ${color}`}>{percent}% match</span>
    </div>
  )
}
