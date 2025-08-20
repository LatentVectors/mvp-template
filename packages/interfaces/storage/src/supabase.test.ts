import { describe, expect, it, vi, beforeEach } from 'vitest'
import { SupabaseStorage } from './supabase'

vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn((_url: string, _key: string) => ({
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn(async (_path: string, _file: Blob) => ({
            data: { path: _path },
            error: null,
          })),
          createSignedUrl: vi.fn(async (_path: string, _expires: number) => ({
            data: { signedUrl: `https://signed.example/${_path}` },
            error: null,
          })),
          remove: vi.fn(async () => ({ error: null })),
        })),
      },
    })),
  }
})

describe('SupabaseStorage', () => {
  const originalEnv = { ...process.env }
  beforeEach(() => {
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
  })

  it('uploads and returns path', async () => {
    const storage = new SupabaseStorage()
    const result = await storage.upload({
      bucket: 'user-files',
      path: 'user/images/a.png',
      blob: new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' }),
      contentType: 'image/png',
    })
    expect(result.path).toBe('user/images/a.png')
  })

  it('creates signed url', async () => {
    const storage = new SupabaseStorage()
    const { url } = await storage.getUrl({
      bucket: 'user-files',
      path: 'user/images/a.png',
      expiresInSeconds: 120,
    })
    expect(url).toContain('https://signed.example/user/images/a.png')
  })
})


