import 'server-only'
import { SupabaseStorage, StorageProvider } from '@repo/interfaces-storage'

export function getStorage() {
  const provider =
    (process.env.STORAGE_PROVIDER as StorageProvider) ||
    StorageProvider.Supabase
  if (provider === StorageProvider.Supabase) {
    return new SupabaseStorage()
  }
  throw new Error(`Unsupported STORAGE_PROVIDER: ${provider}`)
}
