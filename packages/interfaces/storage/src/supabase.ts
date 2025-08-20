import { createClient } from '@supabase/supabase-js'
import type { StoragePort, StorageUploadInput, StorageGetUrlInput } from './port'

function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('Supabase service role is not configured')
  }
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export class SupabaseStorage implements StoragePort {
  async upload(input: StorageUploadInput) {
    const client = getServiceRoleClient()
    // Prefer ArrayBufferView in Node to avoid Blob/FormData quirks
    const file: Blob | ArrayBufferView | ArrayBuffer =
      input.blob instanceof ArrayBuffer
        ? new Uint8Array(input.blob)
        : input.blob instanceof Blob
          ? input.blob
          : input.blob

    const uploadOptions: {
      cacheControl: string
      contentType?: string
      upsert?: boolean
    } = {
      cacheControl: '3600',
    }
    if (input.contentType) uploadOptions.contentType = input.contentType
    if (input.upsert) uploadOptions.upsert = input.upsert

    const { data, error } = await client.storage
      .from(input.bucket)
      .upload(input.path, file, uploadOptions)

    if (error) throw error
    return { path: data.path }
  }

  async getUrl(input: StorageGetUrlInput) {
    const client = getServiceRoleClient()
    const expiresIn = input.expiresInSeconds ?? 60
    const { data, error } = await client.storage
      .from(input.bucket)
      .createSignedUrl(input.path, expiresIn)
    if (error || !data?.signedUrl) {
      throw error ?? new Error('Failed to create signed URL')
    }
    return { url: data.signedUrl }
  }

  async remove({ bucket, paths }: { bucket: 'user-files'; paths: string[] }) {
    const client = getServiceRoleClient()
    const { error } = await client.storage.from(bucket).remove(paths)
    if (error) throw error
    return { success: true }
  }
}


