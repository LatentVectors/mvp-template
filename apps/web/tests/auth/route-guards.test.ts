import { describe, expect, it } from 'vitest'
import {
  buildAuthRedirect,
  computeRedirectForPath,
  isProtectedPath,
} from '@/lib/supabase/auth'

describe('route guard utilities', () => {
  it('detects protected prefixes', () => {
    expect(isProtectedPath('/app')).toBe(true)
    expect(isProtectedPath('/app/settings')).toBe(true)
    expect(isProtectedPath('/')).toBe(false)
    expect(isProtectedPath('/blog/post')).toBe(false)
  })

  it('builds auth redirect with returnTo', () => {
    expect(buildAuthRedirect('/app', '')).toBe('/auth?returnTo=%2Fapp')
    expect(buildAuthRedirect('/app/settings', '?tab=billing')).toBe(
      '/auth?returnTo=%2Fapp%2Fsettings%3Ftab%3Dbilling'
    )
  })

  it('computes redirect for unauthenticated protected routes', () => {
    expect(
      computeRedirectForPath({ pathname: '/app', isAuthenticated: false })
    ).toBe('/auth?returnTo=%2Fapp')

    expect(
      computeRedirectForPath({
        pathname: '/app/settings',
        search: '?tab=billing',
        isAuthenticated: false,
      })
    ).toBe('/auth?returnTo=%2Fapp%2Fsettings%3Ftab%3Dbilling')
  })

  it('returns null when authenticated or path is public', () => {
    expect(
      computeRedirectForPath({ pathname: '/app', isAuthenticated: true })
    ).toBeNull()

    expect(
      computeRedirectForPath({ pathname: '/', isAuthenticated: false })
    ).toBeNull()
  })
})
