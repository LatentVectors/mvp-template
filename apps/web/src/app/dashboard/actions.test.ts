import { describe, it, expect, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { signOut: vi.fn().mockResolvedValue(undefined) },
  }),
}))

describe('dashboard actions', () => {
  it('logout signs out and redirects to home', async () => {
    const { logout } = await import('./actions')
    const { redirect } = await import('next/navigation')
    const { createClient } = await import('@/lib/supabase/server')

    await logout()

    expect(createClient).toHaveBeenCalled()
    const client = await (vi.mocked(createClient).mock.results[0]
      ?.value as Promise<{ auth: { signOut: () => Promise<void> } }>)
    expect(client.auth.signOut).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/')
  })
})
