import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

let currentUser: any = null
vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: currentUser } }),
    },
  }),
}))

// Minimal NextRequest mock helper
function createRequest(path: string) {
  const url = `http://localhost${path}`
  const req = new NextRequest(url)
  return req
}

describe('middleware', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
  })

  it('redirects unauthenticated user from protected route', async () => {
    currentUser = null
    const { middleware } = await import('@/middleware')
    const req = createRequest('/app')
    const res = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/auth?returnTo=%2Fapp')
  })

  it('allows authenticated user through', async () => {
    currentUser = { id: 'u1' }
    const { middleware } = await import('@/middleware')
    const req = createRequest('/app')
    const res = await middleware(req)
    expect(res.status).toBe(200)
  })

  it('does not affect marketing/public routes', async () => {
    currentUser = null
    const { middleware } = await import('@/middleware')
    const req = createRequest('/')
    const res = await middleware(req)
    expect(res.status).toBe(200)
    expect(res.headers.get('location')).toBeNull()
  })
})
