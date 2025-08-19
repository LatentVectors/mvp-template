import React from 'react'

export default function AppLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="bg-muted h-6 w-40 animate-pulse rounded" />
      <div className="bg-muted h-24 animate-pulse rounded" />
    </div>
  )
}
