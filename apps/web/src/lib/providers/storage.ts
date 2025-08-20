import 'server-only'
import { SupabaseStorage } from '@repo/interfaces-storage'

export type StorageProvider = 'supabase'

export function getStorage() {
  const provider = (process.env.STORAGE_PROVIDER ||
    'supabase') as StorageProvider
  if (provider === 'supabase') {
    return new SupabaseStorage()
  }
  throw new Error(`Unsupported STORAGE_PROVIDER: ${provider}`)
}
