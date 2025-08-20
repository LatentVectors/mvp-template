// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'
import { SupabaseStorage, buildUserFilePath } from '@repo/interfaces-storage'
import { randomUUID } from 'crypto'
import { createServiceRoleClient } from '@/lib/supabase/server'

describe('Storage Integration', () => {
  let storage: SupabaseStorage
  beforeAll(async () => {
    storage = new SupabaseStorage()
    const supabase = createServiceRoleClient()
    // Ensure bucket exists locally
    const { data: bucket } = await supabase.storage.getBucket('user-files')
    if (!bucket) {
      await supabase.storage.createBucket('user-files', { public: false })
    }
  })

  it('uploads a small blob and returns a signed URL', async () => {
    const userId = randomUUID()
    const path = buildUserFilePath(userId, 'hello.txt', 'tests')
    const blob = new Blob([new TextEncoder().encode('hello world')], {
      type: 'text/plain',
    })

    // Log around upload to help debug local hangs
    // eslint-disable-next-line no-console
    console.log('Starting upload to storage...')
    const { path: uploadedPath } = await storage.upload({
      bucket: 'user-files',
      path,
      blob,
      contentType: 'text/plain',
      upsert: true,
    })
    // eslint-disable-next-line no-console
    console.log('Upload complete, requesting signed URL...')
    expect(uploadedPath).toBe(path)

    const { url } = await storage.getUrl({
      bucket: 'user-files',
      path,
      expiresInSeconds: 60,
    })
    // eslint-disable-next-line no-console
    console.log('Signed URL generated:', url)
    expect(typeof url).toBe('string')
    expect(url.length).toBeGreaterThan(0)

    // cleanup
    const { success } = await storage.remove({
      bucket: 'user-files',
      paths: [path],
    })
    expect(success).toBe(true)
  }, 30000)
})
