import { Inbox } from 'lucide-react'

export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="card animate-pulse space-y-3">
      <div className="skeleton h-5 w-2/3 rounded" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-3 rounded" style={{ width: `${85 - i * 10}%` }} />
      ))}
      <div className="flex gap-2 pt-2">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="card animate-pulse flex items-start gap-4">
      <div className="skeleton w-12 h-12 rounded-xl" />
      <div className="space-y-2 flex-1">
        <div className="skeleton h-8 w-20 rounded" />
        <div className="skeleton h-3 w-32 rounded" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="skeleton h-4 rounded w-3/4" />
        </td>
      ))}
    </tr>
  )
}

export function EmptyState({ icon, title = 'Nothing here yet', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 flex items-center justify-center mb-4 text-emerald-700 shadow-inner">
        {icon && typeof icon !== 'string' ? (
          icon
        ) : (
          <Inbox className="w-8 h-8 text-emerald-600/80" />
        )}
      </div>
      <h3 className="font-display font-bold text-slate-800 text-base mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-500 max-w-sm leading-relaxed">{description}</p>}
    </div>
  )
}
