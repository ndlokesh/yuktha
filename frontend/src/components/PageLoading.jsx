import React from 'react'

export default function PageLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-950 text-white px-4">
      <div className="relative w-14 h-14 mb-4">
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse" />
        {/* Spinner */}
        <div className="w-full h-full rounded-2xl border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-emerald-400">
          Y
        </div>
      </div>
      <div className="text-xs font-semibold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>Loading Portal View...</span>
      </div>
    </div>
  )
}
