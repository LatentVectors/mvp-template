# Spec Tasks

## Tasks

- [x] 1. StoragePort + SupabaseStorage
  - [x] 1.1 Write unit tests collocated with sources using `{source_name}.test.ts` for `packages/interfaces/storage/src/port.ts` and `packages/interfaces/storage/src/supabase.ts`.
  - [x] 1.2 Implement `StoragePort` interface in `packages/interfaces/storage/src/port.ts`.
  - [x] 1.3 Implement `SupabaseStorage` adapter in `packages/interfaces/storage/src/supabase.ts` using `@supabase/supabase-js` (server client).
  - [x] 1.4 Add path convention helper and signed URL support (`getUrl`).
  - [x] 1.5 Add integration test in `apps/web/tests/integration/storage.integration.test.ts` to upload a small blob and assert a signed URL is returned.
  - [x] 1.6 Verify all tests pass.

- [x] 2. EmailPort + ResendEmail
  - [x] 2.1 Write unit tests collocated with sources using `{source_name}.test.ts` for `packages/interfaces/email/src/port.ts` and `packages/interfaces/email/src/resend.ts`.
  - [x] 2.2 Implement `EmailPort` interface in `packages/interfaces/email/src/port.ts`.
  - [x] 2.3 Implement `ResendEmail` adapter in `packages/interfaces/email/src/resend.ts` using the official Resend SDK.
  - [x] 2.4 Implement safe "not configured" handling when `RESEND_API_KEY` is absent (return explicit status without throwing in normal flows).
  - [x] 2.5 Add integration test in `apps/web/tests/integration/email.integration.test.ts` that asserts correct behavior with and without credentials (mock SDK where appropriate).
  - [x] 2.6 Verify all tests pass.

- [x] 3. PaymentPort + LemonSqueezy
  - [x] 3.1 Write unit tests collocated with sources using `{source_name}.test.ts` for `packages/interfaces/payments/src/port.ts` and `packages/interfaces/payments/src/lemonsqueezy.ts`.
  - [x] 3.2 Implement `PaymentPort` interface in `packages/interfaces/payments/src/port.ts`.
  - [x] 3.3 Implement `LemonSqueezyPayments` adapter in `packages/interfaces/payments/src/lemonsqueezy.ts` using the official Lemon Squeezy SDK for `createCheckout`.
  - [x] 3.4 Provide `verifyWebhook` function signature with a placeholder implementation (full processing deferred to Phase 6); include SDK-based verification if trivial, otherwise return a clear `NotImplemented` error.
  - [x] 3.5 Add integration test in `apps/web/tests/integration/payments.integration.test.ts` that mocks the SDK and asserts the returned checkout URL shape/host.
  - [x] 3.6 Verify all tests pass.

- [x] 4. Provider binding layer (web)
  - [x] 4.1 Write unit tests collocated with sources using `{source_name}.test.tsx` for `apps/web/src/lib/providers/{storage,payments,email}.ts` verifying env-based selection.
  - [x] 4.2 Implement `apps/web/src/lib/providers/{storage,payments,email}.ts` to bind ports to default adapters based on env (`STORAGE_PROVIDER`, `PAYMENTS_PROVIDER`, `EMAIL_PROVIDER`).
  - [x] 4.3 Ensure server-only imports for sensitive SDK usage; never expose service role keys to the client.
  - [x] 4.4 Verify all tests pass.

- [x] 5. Documentation & environment
  - [x] 5.1 Update `README.md` files to document required env vars (`STORAGE_PROVIDER`, `PAYMENTS_PROVIDER`, `EMAIL_PROVIDER`, `LEMONSQUEEZY_*`, `RESEND_API_KEY`).
  - [x] 5.2 Update `.env.example` with the new variables and brief descriptions.
  - [x] 5.3 Verify all tests pass.
