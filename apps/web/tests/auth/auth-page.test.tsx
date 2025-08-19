import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import AuthPage from '@/app/(marketing)/auth/page'

vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({ replace: vi.fn(), push: vi.fn(), prefetch: vi.fn() }),
    useSearchParams: () => new URLSearchParams(''),
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
              <h2>Sign in</h2>
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
              <h2>Create account</h2>
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
              <h2>Reset password</h2>
              <label>
                Email
                <input type="text" aria-label="Email" />
              </label>
              {/* The page provides its own Send reset link button; including here is harmless */}
            </>
          )}
        </div>
      )
    },
  }
})

describe('AuthPage', () => {
  test('renders sign-in view with email/password and submit button', async () => {
    render(<AuthPage />)

    // Heading reflects current view (h1)
    expect(
      screen.getByRole('heading', { name: /sign in/i, level: 1 })
    ).toBeInTheDocument()

    // At least one textbox (email) and a password input should exist
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

    // Submit button for sign in
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('can switch to sign-up and reset-password views', async () => {
    const user = userEvent.setup()
    render(<AuthPage />)

    // Switch to Sign up
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(
      screen.getByRole('heading', { name: /create account/i, level: 1 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument()

    // Switch to Reset password
    await user.click(screen.getByRole('button', { name: /reset password/i }))
    expect(
      screen.getByRole('heading', { name: /reset password/i, level: 1 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /send reset link/i })
    ).toBeInTheDocument()

    // Back to Sign in
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(
      screen.getByRole('heading', { name: /sign in/i, level: 1 })
    ).toBeInTheDocument()
  })
})
