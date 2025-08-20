# Spec Tasks

## Tasks

- [ ] 1. StoragePort + SupabaseStorage
  - [ ] 1.1 Write unit tests collocated with sources using `{source_name}.test.ts` for `packages/interfaces/storage/src/port.ts` and `packages/interfaces/storage/src/supabase.ts`.
  - [ ] 1.2 Implement `StoragePort` interface in `packages/interfaces/storage/src/port.ts`.
  - [ ] 1.3 Implement `SupabaseStorage` adapter in `packages/interfaces/storage/src/supabase.ts` using `@supabase/supabase-js` (server client).
  - [ ] 1.4 Add path convention helper and signed URL support (`getUrl`).
  - [ ] 1.5 Add integration test in `apps/web/tests/integration/storage.integration.test.ts` to upload a small blob and assert a signed URL is returned.
  - [ ] 1.6 Verify all tests pass.

- [ ] 2. EmailPort + ResendEmail
  - [ ] 2.1 Write unit tests collocated with sources using `{source_name}.test.ts` for `packages/interfaces/email/src/port.ts` and `packages/interfaces/email/src/resend.ts`.
  - [ ] 2.2 Implement `EmailPort` interface in `packages/interfaces/email/src/port.ts`.
  - [ ] 2.3 Implement `ResendEmail` adapter in `packages/interfaces/email/src/resend.ts` using the official Resend SDK.
  - [ ] 2.4 Implement safe "not configured" handling when `RESEND_API_KEY` is absent (return explicit status without throwing in normal flows).
  - [ ] 2.5 Add integration test in `apps/web/tests/integration/email.integration.test.ts` that asserts correct behavior with and without credentials (mock SDK where appropriate).
  - [ ] 2.6 Verify all tests pass.

- [ ] 3. PaymentPort + LemonSqueezy
  - [ ] 3.1 Write unit tests collocated with sources using `{source_name}.test.ts` for `packages/interfaces/payments/src/port.ts` and `packages/interfaces/payments/src/lemonsqueezy.ts`.
  - [ ] 3.2 Implement `PaymentPort` interface in `packages/interfaces/payments/src/port.ts`.
  - [ ] 3.3 Implement `LemonSqueezyPayments` adapter in `packages/interfaces/payments/src/lemonsqueezy.ts` using the official Lemon Squeezy SDK for `createCheckout`.
  - [ ] 3.4 Provide `verifyWebhook` function signature with a placeholder implementation (full processing deferred to Phase 6); include SDK-based verification if trivial, otherwise return a clear `NotImplemented` error.
  - [ ] 3.5 Add integration test in `apps/web/tests/integration/payments.integration.test.ts` that mocks the SDK and asserts the returned checkout URL shape/host.
  - [ ] 3.6 Verify all tests pass.

- [ ] 4. Provider binding layer (web)
  - [ ] 4.1 Write unit tests collocated with sources using `{source_name}.test.tsx` for `apps/web/src/lib/providers/{storage,payments,email}.ts` verifying env-based selection.
  - [ ] 4.2 Implement `apps/web/src/lib/providers/{storage,payments,email}.ts` to bind ports to default adapters based on env (`STORAGE_PROVIDER`, `PAYMENTS_PROVIDER`, `EMAIL_PROVIDER`).
  - [ ] 4.3 Ensure server-only imports for sensitive SDK usage; never expose service role keys to the client.
  - [ ] 4.4 Verify all tests pass.

- [ ] 5. Documentation & environment
  - [ ] 5.1 Update `README.md` files to document required env vars (`STORAGE_PROVIDER`, `PAYMENTS_PROVIDER`, `EMAIL_PROVIDER`, `LEMONSQUEEZY_*`, `RESEND_API_KEY`).
  - [ ] 5.2 Update `.env.example` with the new variables and brief descriptions.
  - [ ] 5.3 Verify all tests pass.
