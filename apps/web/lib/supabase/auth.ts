/**
 * Authentication helpers and route guard utilities.
 */

import type { Session, User } from '@supabase/supabase-js'
// Avoid importing the browser client at module top-level to keep server-only
// contexts (like middleware tests) from pulling in browser SSR exports.
let browserSupabase: typeof import('@/lib/supabase/client').supabase | null =
  null
async function getBrowserClient() {
  if (!browserSupabase) {
    const mod = await import('@/lib/supabase/client')
    browserSupabase = mod.supabase
  }
  return browserSupabase!
}
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server'

/**
 * URL path prefixes that require authentication.
 * Adjust as your protected app grows (e.g., add '/dashboard').
 */
export const PROTECTED_PATH_PREFIXES = ['/app']

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(prefix + '/')
  )
}

export function buildAuthRedirect(
  pathname: string,
  search: string = ''
): string {
  const fullPath = `${pathname}${search || ''}`
  const returnTo = encodeURIComponent(fullPath)
  return `/auth?returnTo=${returnTo}`
}

export function computeRedirectForPath(args: {
  pathname: string
  search?: string
  isAuthenticated: boolean
}): string | null {
  const { pathname, search = '', isAuthenticated } = args
  if (!isProtectedPath(pathname)) {
    return null
  }
  if (isAuthenticated) {
    return null
  }
  return buildAuthRedirect(pathname, search)
}

// Server helpers
export async function getServerSession(): Promise<Session | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    return null
  }
  return data.session
}

export async function getServerUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

// Client helpers
export async function getClientSession(): Promise<Session | null> {
  const client = await getBrowserClient()
  const { data, error } = await client.auth.getSession()
  if (error) {
    return null
  }
  return data.session
}

export async function getClientUser(): Promise<User | null> {
  const client = await getBrowserClient()
  const { data } = await client.auth.getUser()
  return data.user ?? null
}
