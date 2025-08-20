import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as server from '@/lib/supabase/server'
import { supabase as browserSupabase } from '@/lib/supabase/client'
import {
  getClientSession,
  getClientUser,
  getServerSession,
  getServerUser,
  isProtectedPath,
  buildAuthRedirect,
  computeRedirectForPath,
} from '@/lib/supabase/auth'

vi.mock('@/lib/supabase/client', async importOriginal => {
  const actual =
    (await importOriginal()) as typeof import('@/lib/supabase/client')
  return {
    ...actual,
    supabase: {
      auth: {
        getSession: vi.fn(),
        getUser: vi.fn(),
      },
    },
  }
})

describe('auth session helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('getServerSession returns session or null', async () => {
    vi.spyOn(server, 'createClient').mockResolvedValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { id: 's' } },
        }),
      },
    } as never)
    expect(await getServerSession()).toEqual({ id: 's' })

    vi.spyOn(server, 'createClient').mockResolvedValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: null },
          error: { message: 'x' },
        }),
      },
    } as never)
    expect(await getServerSession()).toBeNull()
  })

  it('getServerUser returns user or null', async () => {
    vi.spyOn(server, 'createClient').mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u' } } }),
      },
    } as never)
    expect(await getServerUser()).toEqual({ id: 'u' })

    vi.spyOn(server, 'createClient').mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as never)
    expect(await getServerUser()).toBeNull()
  })

  it('client helpers return session/user or null', async () => {
    ;(
      browserSupabase.auth.getSession as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: { session: { id: 'cs' } },
    })
    expect(await getClientSession()).toEqual({ id: 'cs' })
    ;(
      browserSupabase.auth.getSession as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: { session: null },
      error: { message: 'x' },
    })
    expect(await getClientSession()).toBeNull()
    ;(
      browserSupabase.auth.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: { user: { id: 'cu' } },
    })
    expect(await getClientUser()).toEqual({ id: 'cu' })
    ;(
      browserSupabase.auth.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: { user: null },
    })
    expect(await getClientUser()).toBeNull()
  })
})

describe('route guard utilities', () => {
  it('detects protected prefixes', () => {
    expect(isProtectedPath('/dashboard')).toBe(true)
    expect(isProtectedPath('/dashboard/settings')).toBe(true)
    expect(isProtectedPath('/')).toBe(false)
    expect(isProtectedPath('/blog/post')).toBe(false)
  })

  it('builds auth redirect with returnTo', () => {
    expect(buildAuthRedirect('/dashboard', '')).toBe(
      '/auth?returnTo=%2Fdashboard'
    )
    expect(buildAuthRedirect('/dashboard/settings', '?tab=billing')).toBe(
      '/auth?returnTo=%2Fdashboard%2Fsettings%3Ftab%3Dbilling'
    )
  })

  it('computes redirect for unauthenticated protected routes', () => {
    expect(
      computeRedirectForPath({ pathname: '/dashboard', isAuthenticated: false })
    ).toBe('/auth?returnTo=%2Fdashboard')

    expect(
      computeRedirectForPath({
        pathname: '/dashboard/settings',
        search: '?tab=billing',
        isAuthenticated: false,
      })
    ).toBe('/auth?returnTo=%2Fdashboard%2Fsettings%3Ftab%3Dbilling')
  })

  it('returns null when authenticated or path is public', () => {
    expect(
      computeRedirectForPath({ pathname: '/dashboard', isAuthenticated: true })
    ).toBeNull()

    expect(
      computeRedirectForPath({ pathname: '/', isAuthenticated: false })
    ).toBeNull()
  })
})
