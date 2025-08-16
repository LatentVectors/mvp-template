/**
 * @fileoverview Supabase browser client for client-side operations
 *
 * This client is designed for use in browser environments and includes
 * automatic session management and authentication state handling.
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@repo/types'

/**
 * Creates a Supabase client for browser/client-side usage
 *
 * This client:
 * - Automatically manages user sessions in localStorage
 * - Handles authentication state changes
 * - Safe to use in React components and client-side code
 * - Uses the anonymous key (safe to expose publicly)
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Default browser client instance
 *
 * Use this for most client-side operations:
 * ```ts
 * import { supabase } from '@/lib/supabase/client'
 *
 * const { data, error } = await supabase.from('profiles').select('*')
 * ```
 */
export const supabase = createClient()

/**
 * Type export for use in components
 */
export type SupabaseClient = ReturnType<typeof createClient>
