import { describe, it, expect } from 'vitest'

describe('storage provider binding', () => {
  it('defaults to supabase', async () => {
    delete process.env.STORAGE_PROVIDER
    const mod = await import('./storage')
    const client = mod.getStorage()
    expect(client).toBeTruthy()
  })

  it('throws on unsupported provider', async () => {
    process.env.STORAGE_PROVIDER = 'unknown' as any
    const mod = await import('./storage')
    expect(() => mod.getStorage()).toThrow(/Unsupported STORAGE_PROVIDER/)
  })
})
