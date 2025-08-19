# Spec Tasks

## Tasks

- [x]
  1. Resend SMTP and Sending Domain Configuration
  - [x] 1.2 Configure Resend sending subdomain (e.g., `mail.example.com`); add SPF, DKIM, DMARC (`p=quarantine`) DNS records
  - [x] 1.3 Set From: `no-reply@mail.example.com`, Reply-To: `support@example.com` in environment/config
  - [x] 1.4 Configure Supabase Auth email settings to use verified domain; enable email confirmations and password reset
  - [x] 1.5 Create a simple server-only test endpoint/action to trigger a verification-like email using EmailPort (for manual smoke test)

- [x] 2. Supabase Auth UI Integration (Signup/Login/Reset)
  - [x] 2.1 Write tests for auth screen rendering and basic form behaviors (presence of email/password, submit button)
  - [x] 2.2 Implement auth page using `@supabase/auth-ui-react` (signup, login, reset) with minimal Tailwind/shadcn styling
  - [x] 2.3 Ensure the page lives under public routes (e.g., `(marketing)/auth`); add links from navbar/CTA
  - [x] 2.4 Wire the browser Supabase client in `apps/web/lib/supabase/client.ts` and type it with generated types
  - [x] 2.5 Configure copy/labels and success/error toasts; avoid leaking technical errors
  - [x] 2.6 Verify password reset email flow works end-to-end (manual)

- [ ] 3. Route Protection & Session Management
  - [ ] 3.1 Write tests for route guard utilities: unauthenticated → redirect; authenticated → allow
  - [ ] 3.2 Implement session helpers in `apps/web/lib/supabase/auth.ts` for reading session on client and server
  - [ ] 3.3 Add `middleware.ts` to redirect unauthenticated users away from `(app)` group
  - [ ] 3.4 Enforce 7-day rolling sessions (Supabase setting); verify refresh behavior locally
  - [ ] 3.5 Add return-to URL handling after login for deep links

- [ ] 4. Protected App Shell & Basic Dashboard
  - [ ] 4.1 Write tests for dashboard UI: renders user email and logout control when authenticated
  - [ ] 4.2 Implement `(app)/layout.tsx` protected app shell and `(app)/page.tsx` dashboard
  - [ ] 4.3 Implement logout action; clear session and redirect to landing page
  - [ ] 4.4 Validate that analytics/cookie scripts on marketing pages remain unaffected by auth pages
  - [ ] 4.5 Add minimal empty states and loading skeletons

- [ ] 5. Deployment & E2E Validation
  - [ ] 5.1 Write Playwright tests for login → dashboard → logout using a seeded test user (skip email verification in E2E)
  - [ ] 5.2 Seed a test user in staging (SQL or Supabase dashboard) for E2E login
  - [ ] 5.3 Configure Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Resend credentials; ensure no service role keys on client
  - [ ] 5.4 Deploy to staging; run E2E against staging; fix any failures
  - [ ] 5.5 Manual end-to-end check: signup → verify email → login → dashboard → logout
  - [ ] 5.6 Promote to production after sign-off

## Notes

- Follow schema-first and security defaults: client uses anon key under RLS; keep privileged operations on server route handlers only.
- For E2E signup with verification, prefer manual validation or token-based confirmation in staging; automated inbox access is out-of-scope for MVP.
