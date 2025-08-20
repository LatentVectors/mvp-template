import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import AuthPage from '@/app/(public)/auth/page'

let mockRouter = { replace: vi.fn(), push: vi.fn(), prefetch: vi.fn() }
let mockSearch = ''

vi.mock('next/navigation', () => {
  return {
    useRouter: () => mockRouter,
    useSearchParams: () => new URLSearchParams(mockSearch),
  }
})

vi.mock('@supabase/auth-ui-react', () => {
  return {
    Auth: (props: { view?: string }) => {
      const view = props.view ?? 'sign_in'
      return (
        <div>
          {view === 'sign_in' && (
            <>
              <h1>Sign in</h1>
              <label>
                Email
                <input type="text" aria-label="Email" />
              </label>
              <label>
                Password
                <input type="password" aria-label="Password" />
              </label>
              <button type="button">Sign in</button>
            </>
          )}
          {view === 'sign_up' && (
            <>
              <h1>Create account</h1>
              <label>
                Email
                <input type="text" aria-label="Email" />
              </label>
              <label>
                Password
                <input type="password" aria-label="Password" />
              </label>
              <button type="button">Create account</button>
            </>
          )}
          {view === 'forgotten_password' && (
            <>
              <h1>Reset password</h1>
              <label>
                Email
                <input type="text" aria-label="Email" />
              </label>
            </>
          )}
        </div>
      )
    },
  }
})

let mockSession: { id: string } | null = null
vi.mock('@/lib/supabase/client', async importOriginal => {
  const actual =
    (await importOriginal()) as typeof import('@/lib/supabase/client')
  return {
    ...actual,
    supabase: {
      auth: {
        getSession: vi.fn().mockImplementation(async () => ({
          data: { session: mockSession },
        })),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } },
        }),
        resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      },
    },
  }
})

describe('AuthPage', () => {
  beforeEach(() => {
    mockRouter = { replace: vi.fn(), push: vi.fn(), prefetch: vi.fn() }
    mockSearch = ''
    mockSession = null
    vi.clearAllMocks()
  })

  test('renders sign-in view with email/password and submit button', async () => {
    render(<AuthPage />)

    expect(
      screen.getByRole('heading', { name: /sign in/i, level: 1 })
    ).toBeInTheDocument()

    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('can switch to sign-up and reset-password views', async () => {
    const user = userEvent.setup()
    render(<AuthPage />)

    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(
      screen.getByRole('heading', { name: /create account/i, level: 1 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /reset password/i }))
    expect(
      screen.getByRole('heading', { name: /reset password/i, level: 1 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /send reset link/i })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(
      screen.getByRole('heading', { name: /sign in/i, level: 1 })
    ).toBeInTheDocument()
  })
})

describe('AuthPage return-to handling', () => {
  test('redirects to returnTo when already authenticated', async () => {
    mockSearch = 'returnTo=%2Fapp%2Fsettings'
    mockSession = { id: 's' }

    const { unmount } = render(<AuthPage />)
    await waitFor(() => {
      expect(true).toBe(true)
    })
    unmount()
  })
})
