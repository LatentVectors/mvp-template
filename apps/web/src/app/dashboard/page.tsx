import React from 'react'

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Welcome to your dashboard.</p>
      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-medium">Getting started</h2>
        <p className="text-muted-foreground text-sm">
          This area will show your recent activity and key metrics.
        </p>
      </div>
    </div>
  )
}
