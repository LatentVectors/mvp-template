import React from 'react'
import { getServerUser } from '@/lib/supabase/auth'
import { logout } from './actions'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getServerUser()

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          {user && (
            <span
              aria-label="user-email"
              className="text-muted-foreground text-sm"
            >
              {user.email}
            </span>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm"
              aria-label="Sign out"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
