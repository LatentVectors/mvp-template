import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { computeRedirectForPath } from '@/lib/supabase/auth'

export async function middleware(request: NextRequest) {
  // Prepare a mutable response that we can attach refreshed cookies to
  const response = NextResponse.next()

  // Create a Supabase client bound to request/response cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Trigger a session check/refresh; this also rolls cookies forward when valid
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const redirectPath = computeRedirectForPath({
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    isAuthenticated: Boolean(user),
  })

  if (redirectPath) {
    const url = new URL(redirectPath, request.url)
    return NextResponse.redirect(url)
  }

  return response
}

// Run on protected app routes only. Adjust as needed.
export const config = {
  matcher: ['/app/:path*'],
}
