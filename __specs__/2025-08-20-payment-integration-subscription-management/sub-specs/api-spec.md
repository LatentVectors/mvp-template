# API Specification

This is the API specification for the spec detailed in @**specs**/2025-08-20-payment-integration-subscription-management/spec.md

## Endpoints

### POST /api/webhooks/lemonsqueezy

**Purpose:** Receive Lemon Squeezy webhook events and update subscription state. **Parameters:** Raw body; headers include signature and event metadata. **Response:** 200 OK on success; 401 Unauthorized on signature failure; 2xx even on already-processed events (idempotent). **Errors:** 400 on malformed payload; 401 on invalid signature; 500 on unexpected processing error (with safe logging).

### POST /api/payments/create-checkout

**Purpose:** Create a hosted checkout URL for a given plan. **Parameters:** JSON body: `{ planId: string, returnUrl?: string }`. User is implied by server session. **Response:** `{ url: string }` where `url` is a Lemon Squeezy-hosted checkout URL (sandbox if test mode). **Errors:** 401 if unauthenticated; 400 if plan invalid; 500 on provider errors.

## Controllers

- WebhookController
  - Action: `handleLemonSqueezyWebhook(req)`
  - Responsibilities: verify HMAC, parse event, call SubscriptionService to apply changes, handle idempotency.
- PaymentsController
  - Action: `createCheckout(planId, userId, returnUrl)`
  - Responsibilities: call `PaymentPort.createCheckout`, return URL to client or redirect in server action context.

## Purpose

- Provide secure, minimal endpoints to connect payments provider events and the app's subscription state, and enable a simple purchase initiation flow aligned with Phase 6 scope.
