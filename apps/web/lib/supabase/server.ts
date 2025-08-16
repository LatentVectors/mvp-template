/**
 * @fileoverview Supabase server client for server-side operations
 *
 * This client is designed for use in server environments (API routes,
 * Server Components, middleware) and provides both authenticated user
 * operations and service role operations for admin tasks.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@repo/types'

/**
 * Creates a Supabase client for server-side usage with user context
 *
 * This client:
 * - Reads user session from cookies
 * - Respects Row Level Security (RLS) policies
 * - Uses the anonymous key for user-level operations
 * - Should be used in Server Components and API routes for user data
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Creates a Supabase client with service role privileges
 *
 * This client:
 * - Bypasses Row Level Security (RLS) policies
 * - Has full database access
 * - Should ONLY be used for admin operations
 * - NEVER expose this client to the browser
 *
 * Use cases:
 * - Creating users programmatically
 * - Admin operations that need to bypass RLS
 * - Data migrations and bulk operations
 */
export function createServiceRoleClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // Service role client doesn't need cookie management
        },
      },
    }
  )
}

/**
 * Type exports for use in server components and API routes
 */
export type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>
export type ServiceRoleSupabaseClient = ReturnType<
  typeof createServiceRoleClient
>
