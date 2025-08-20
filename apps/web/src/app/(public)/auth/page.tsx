'use client'

import * as React from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

type AuthView = 'sign_in' | 'sign_up' | 'forgotten_password'

// Separate component that handles search params
function AuthForm() {
  const [view, setView] = React.useState<AuthView>('sign_in')
  const [message, setMessage] = React.useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams?.get('returnTo')

  React.useEffect(() => {
    setMessage(null)
  }, [view])

  React.useEffect(() => {
    let mounted = true
    const run = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) {
        return
      }
      if (data.session) {
        router.replace((returnTo || '/dashboard') as never)
      }
    }
    run()
    const { data: sub } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_IN') {
        router.replace((returnTo || '/dashboard') as never)
      }
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [router, returnTo])

  return (
    <div className="supabase-auth rounded-lg border p-4">
      <Auth
        supabaseClient={supabase as never}
        view={view as never}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'var(--color-primary)',
                brandAccent: 'var(--color-primary)',
                brandButtonText: 'var(--color-primary-foreground)',
                inputBackground: 'var(--color-card)',
                inputText: 'var(--color-foreground)',
                inputPlaceholder: 'var(--color-muted-foreground)',
                inputBorder: 'var(--color-border)',
                anchorTextColor: 'var(--color-primary)',
                messageText: 'var(--color-foreground)',
              },
            },
            dark: {
              colors: {
                brand: 'var(--color-primary)',
                brandAccent: 'var(--color-primary)',
                brandButtonText: 'var(--color-primary-foreground)',
                inputBackground: 'var(--color-card)',
                inputText: 'var(--color-foreground)',
                inputPlaceholder: 'var(--color-muted-foreground)',
                inputBorder: 'var(--color-border)',
                anchorTextColor: 'var(--color-primary)',
                messageText: 'var(--color-foreground)',
              },
            },
          },
        }}
        providers={[]}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign in',
            },
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Create account',
            },
            forgotten_password: {
              email_label: 'Email',
              button_label: 'Send reset link',
            },
          },
        }}
        redirectTo={typeof window !== 'undefined' ? window.location.origin : ''}
        showLinks={false}
      />

      {message && (
        <p role="status" className="text-muted-foreground mt-4 text-sm">
          {message}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {view !== 'sign_in' && (
          <button
            type="button"
            className="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm"
            onClick={() => setView('sign_in')}
          >
            Sign in
          </button>
        )}
        {view !== 'sign_up' && (
          <button
            type="button"
            className="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm"
            onClick={() => setView('sign_up')}
          >
            Create account
          </button>
        )}
        {view !== 'forgotten_password' && (
          <button
            type="button"
            className="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm"
            onClick={() => setView('forgotten_password')}
          >
            Reset password
          </button>
        )}
        {view === 'forgotten_password' && (
          <button
            type="button"
            className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm"
            onClick={async () => {
              const emailInput = document.querySelector(
                'input[type="email"]'
              ) as HTMLInputElement | null
              const email = emailInput?.value?.trim()
              if (!email) {
                setMessage('Please enter your email to receive a reset link.')
                return
              }
              let error: { message: string } | null = null
              if (typeof window !== 'undefined') {
                const result = await supabase.auth.resetPasswordForEmail(
                  email,
                  {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  }
                )
                error = result.error
              } else {
                const result = await supabase.auth.resetPasswordForEmail(email)
                error = result.error
              }
              if (error) {
                setMessage('Unable to send reset link. Please try again.')
              } else {
                setMessage('Reset link sent. Check your email.')
              }
            }}
          >
            Send reset link
          </button>
        )}
      </div>
    </div>
  )
}

// Main page component that renders the form wrapped in Suspense
export default function AuthPage() {
  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Authentication</h1>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  )
}
