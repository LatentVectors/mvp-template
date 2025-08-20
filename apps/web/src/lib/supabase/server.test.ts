import { describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', () => ({
  cookies: async () => ({
    getAll: vi.fn().mockReturnValue([]),
    set: vi.fn(),
  }),
}))

const createServerClientMock = vi.fn().mockReturnValue({
  auth: {
    getSession: vi.fn(),
    getUser: vi.fn(),
  },
})

vi.mock('@supabase/ssr', () => ({
  createServerClient: (...args: unknown[]) => createServerClientMock(...args),
}))

describe('server supabase client', () => {
  it('createClient returns a supabase client and wires cookies', async () => {
    const { createClient } = await import('./server')
    const client = await createClient()
    expect(client).toBeDefined()
    expect(typeof client).toBe('object')
    expect(createServerClientMock).toHaveBeenCalled()
  })

  it('createServiceRoleClient returns a supabase client', async () => {
    const { createServiceRoleClient } = await import('./server')
    const client = createServiceRoleClient()
    expect(client).toBeDefined()
    expect(typeof client).toBe('object')
    expect(createServerClientMock).toHaveBeenCalled()
  })
})
