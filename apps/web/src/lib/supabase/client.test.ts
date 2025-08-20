import { describe, expect, it, vi } from 'vitest'

const createBrowserClientMock = vi.fn().mockReturnValue({
  from: vi.fn(),
  auth: { getSession: vi.fn(), getUser: vi.fn() },
})

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: (...args: unknown[]) => createBrowserClientMock(...args),
}))

describe('browser supabase client', () => {
  it('createClient returns a supabase client', async () => {
    const { createClient } = await import('./client')
    const client = createClient()
    expect(client).toBeDefined()
    expect(typeof client).toBe('object')
    expect(createBrowserClientMock).toHaveBeenCalled()
  })

  it('exports a default supabase instance', async () => {
    const { supabase } = await import('./client')
    expect(supabase).toBeDefined()
    expect(typeof supabase).toBe('object')
  })
})
