# Spec Requirements Document

> Spec: Payment Integration & Subscription Management Created: 2025-08-20

## Overview

Implement Lemon Squeezy billing using the official SDKs: overlay checkout via `lemonsqueezy.js`, a two-step webhook pipeline (receive → QStash → process) with signature verification and idempotency, plan sync to a local `plans` cache powering pricing/checkout, customer portal access, and entitlement/quota enforcement. Supports test mode across environments.

## User Stories

### Keep subscription state in sync

As an operator, I want a two-step webhook pipeline to securely update subscription status so that users immediately gain or lose access based on their payment state.

Detailed workflow: Public receiver verifies Lemon Squeezy HMAC signature and enqueues payload to QStash; an internal processor verifies QStash signatures, ensures idempotency via `processed_webhooks`, and upserts `subscriptions` to reflect `active`, `on_trial`, `past_due`, `cancelled`, `expired`, `paused`, etc.

### Enable a simple, testable purchase and billing management flow

As a user, I want a straightforward checkout that opens a secure overlay and supports test mode, and I can manage my subscription via a customer portal, so that I can purchase and manage plans without friction.

Detailed workflow: An API route uses `@lemonsqueezy/lemonsqueezy.js` to create a checkout (passing `storeId`, `ls_variant_id`, redirect/cancel URLs, and `checkout_data.custom.user_id`), returns a URL that opens via `window.LemonSqueezy.Url.Open(...)`; a portal endpoint returns `attributes.urls.customer_portal` for account management.

### Enforce entitlements and quotas

As a developer, I want a single helper to check entitlements and enforce usage quotas so that gated features are easy to protect and cannot exceed plan limits.

Detailed workflow: A shared helper reads `subscriptions` status (and plan metadata from `plans`) plus usage counters to allow or block actions, incrementing usage when allowed; a `/api/user/subscription-status` endpoint powers optimistic UI polling post‑checkout.

## Spec Scope

1. **Two-step webhooks via QStash** - Public receiver (verify HMAC) → enqueue to QStash → internal processor (verify QStash, idempotency via `processed_webhooks`) updates `subscriptions` and `profiles`.
2. **Checkout and portal APIs** - Create checkout with `@lemonsqueezy/lemonsqueezy.js` and open via `lemonsqueezy.js` overlay; provide a customer portal URL endpoint.
3. **Plans sync powering pricing** - Scheduled job and endpoint to sync Lemon Squeezy variants into a local `plans` table consumed by pricing/checkout.
4. **Entitlement and quota enforcement** - Helper utilities and `/api/user/subscription-status` to gate access and support optimistic UI.
5. **Environment & observability** - Test/production store separation, Sentry logging, and DLQ/cron configuration.

## Out of Scope

- Complex pricing pages or plan management UI beyond a basic checkout trigger.
- Refunds, proration, coupons, trials configuration UI, and tax/VAT configuration.
- Multi-tenant billing or multiple providers (Stripe, Paddle); focus is Lemon Squeezy only.
- Email receipt templates and deliverability work (handled by the email abstraction).

## Expected Deliverable

1. A secure two-step webhook pipeline (receive/process) with idempotency and coverage for key lifecycle events.
2. Checkout and customer portal APIs with overlay-based checkout; integration/E2E tests for success paths and optimistic polling.
3. Plans sync job powering pricing/checkout and entitlement/quota helpers with unit tests; a demo-gated route/action exercising gating.
