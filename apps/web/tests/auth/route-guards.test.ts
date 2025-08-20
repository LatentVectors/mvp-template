import { describe, expect, it } from 'vitest'
import {
  buildAuthRedirect,
  computeRedirectForPath,
  isProtectedPath,
} from '@/lib/supabase/auth'

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
