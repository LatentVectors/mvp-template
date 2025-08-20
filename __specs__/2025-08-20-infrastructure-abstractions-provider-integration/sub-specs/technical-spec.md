# Technical Specification

This is the technical specification for the spec detailed in @**specs**/2025-08-20-infrastructure-abstractions-provider-integration/spec.md

## Technical Requirements

- Define TypeScript ports in shared packages under `packages/`:
  - `packages/interfaces/storage/src/port.ts` with methods: `upload(params)`, `getUrl(params)`, `delete(params)` and a path convention helper.
  - `packages/interfaces/payments/src/port.ts` with `createCheckout(params)` and `verifyWebhook(headers, rawBody)`.
  - `packages/interfaces/email/src/port.ts` with `send(message)`.
  - `packages/interfaces/analytics/src/port.ts` with `track(event)` and `identify(user)` minimal interfaces.
- Default adapters (no new SDKs required):
  - `SupabaseStorage` in `packages/interfaces/storage/src/supabase.ts` using server-side `@supabase/supabase-js`.
  - `LemonSqueezyPayments` in `packages/interfaces/payments/src/lemonsqueezy.ts` generating checkout URLs without SDK; signature verification via Node `crypto` (stub only this phase).
  - `ResendEmail` in `packages/interfaces/email/src/resend.ts` using HTTPS fetch to Resend API from server-only code.
  - `GA4Analytics` binding in web app: load GA via `<Script>` only when `NEXT_PUBLIC_GA_ID` is present; server-side port is a no-op.
- Binding layer (web app):
  - Add `apps/web/src/lib/providers/{storage,payments,email,analytics}.ts` exporting the selected adapter based on env.
  - Env selection variables: `STORAGE_PROVIDER=supabase`, `PAYMENTS_PROVIDER=lemonsqueezy`, `EMAIL_PROVIDER=resend`, `ANALYTICS_PROVIDER=ga4`.
  - Credentials pulled from existing envs (e.g., `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_SIGNING_SECRET`, `RESEND_API_KEY`, Supabase keys already present).
- Verification:
  - Provide unit tests for each adapter to validate method contracts and error handling.
  - Provide integration tests that exercise server-side usage of each port:
    - Storage: upload a small text blob to `userId/dev/yyyy/mm/uuid.txt`, then retrieve a signed URL.
    - Email: conditionally attempt send; when credentials are absent, return explicit "not configured" status and assert safe behavior.
    - Payments: create a checkout URL (stub) and assert shape/host where applicable.
    - Analytics: assert conditional rendering path when `NEXT_PUBLIC_GA_ID` is present.
- Security:
  - All sensitive operations server-side only; never expose service role keys to client.
  - Validate inputs with Zod in any user-invoked actions.
  - Ensure RLS-compatible storage paths (no privileged reads from client).
- Testing:
  - Unit tests for each adapter with mocks.
  - Integration tests in `apps/web/tests/integration` that exercise server-side code paths invoking the ports under a mocked auth/session.

## External Dependencies (Conditional)

- Use the Resend HTTP API (no SDK required) for server-side email sending.
- No Lemon Squeezy SDK; verify webhook signatures with Node `crypto` when implemented in Phase 6.
