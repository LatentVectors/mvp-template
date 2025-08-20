'use server'

import { redirect } from 'next/navigation'
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server'

export async function logout() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/')
}
