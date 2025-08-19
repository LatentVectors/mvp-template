# Technical Specification

This is the technical specification for the spec detailed in @**specs**/2025-08-16-authentication-system/spec.md

## Technical Requirements

- Supabase configuration
  - Use existing Supabase project from Phase 3; ensure email confirmations are enabled.
  - Set auth settings to require email verification; session lifetime: 7-day rolling refresh.
  - Environment variables (web app): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, server-only keys where needed.

- Resend SMTP and domain setup
  - Configure sending subdomain (e.g., `mail.example.com`) in Resend; add DNS for SPF, DKIM, DMARC (`p=quarantine`).
  - Set From: `no-reply@mail.example.com`, Reply-To: `support@example.com` per project standards.
  - Verify test delivery for verification and password reset.

- Next.js app integration
  - Auth UI: integrate `@supabase/auth-ui-react` for signup/login/reset with minimal styling (Tailwind/shadcn).
  - Routing: keep public marketing under `(marketing)` group; protected app under `(app)` group with a simple `page.tsx`.
  - Session helpers: implement in `apps/web/lib/supabase/auth.ts` and server client in `apps/web/lib/supabase/server.ts` for privileged server operations.
  - Route protection: add guard utilities; optionally use `middleware.ts` to redirect unauthenticated users away from `(app)`.
  - Dashboard: show authenticated user identity (email) and a logout button; ensure client uses browser Supabase client.

- Security and handling
  - Never expose service role keys to the client; only use anon key in the browser.
  - Keep sensitive checks server-side; do not add SSR for gated routes (SPA model).
  - Input validation for any forms beyond auth UI (none expected initially).
  - Ensure GA4/cookie consent scripts remain unaffected on public pages; avoid loading analytics in auth-only screens if unnecessary.

- Deployment and environments
  - Configure env vars in Vercel (staging and production) for Supabase and Resend.
  - Validate end-to-end flows post-deploy: signup → verify email → login → access dashboard → logout.
  - Add basic error capture via Sentry (optional for this phase) without blocking auth flows.

## External Dependencies

No new dependencies are required beyond the existing tech stack: Supabase JS, `@supabase/auth-ui-react`, and Resend via the email abstraction.
