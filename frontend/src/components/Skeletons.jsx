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

export function EmptyState({ icon = '📭', title = 'Nothing here yet', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-xs">{description}</p>}
    </div>
  )
}
