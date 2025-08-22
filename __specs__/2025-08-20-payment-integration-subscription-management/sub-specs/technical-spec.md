# Technical Specification

This is the technical specification for the spec detailed in @**specs**/2025-08-20-payment-integration-subscription-management/spec.md

## Technical Requirements

- Webhook Verification
  - Endpoint receives raw request body and `X-Signature`/`X-Event-Name` (exact header per Lemon Squeezy spec).
  - Compute HMAC using `LEMONSQUEEZY_SIGNING_SECRET` and compare in constant time.
  - Return 2xx on valid processing; 401 on signature failure; always idempotent via event `id` de-dup.
- Event Handling
  - Parse events: subscription created/updated/canceled/expired/paused/resumed, invoice paid/payment_failed.
  - Map to internal states in `subscriptions` table; store `external_customer_id`, `external_subscription_id`, plan/variant id, status, current period end.
  - Use upsert patterns; preserve audit timestamps via existing triggers.
- Purchase Flow
  - Server action/util in `apps/web/src/lib/providers/payments.ts` calls `PaymentPort.createCheckout` to get hosted URL.
  - Accept `planId`, `userId`, and `returnUrl`; support `LEMONSQUEEZY_TEST_MODE=true`.
  - Redirect user to checkout from a server action or route handler.
- Entitlements & Quotas
  - Add `apps/web/src/lib/subscriptions/entitlements.ts` with `assertEntitled(userId, feature)` and `assertWithinQuota(userId, feature)`.
  - Read from `subscriptions` and `usage_counters`; return structured allow/deny with reason.
  - Provide `incrementUsage(userId, feature, amount=1)` utility that respects RLS-safe updates.
- Logging & Validation
  - Use structured logs for webhook processing; mask sensitive data.
  - Validate inputs with Zod where applicable.
- Testing
  - Unit tests collocated with source files for webhook verification, event mapping, and entitlement helpers.
  - Integration test that simulates a valid webhook payload and asserts DB state change.
  - E2E (Playwright) happy-path: login → start checkout (mock/sandbox) → arrive back at app; assert gated feature visibility toggle based on mocked subscription state.

## External Dependencies (Conditional)

- None required beyond existing abstractions. Prefer Node `crypto` for HMAC verification to avoid SDK lock-in.
