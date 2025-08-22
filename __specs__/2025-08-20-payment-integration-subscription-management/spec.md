# Spec Requirements Document

> Spec: Payment Integration & Subscription Management Created: 2025-08-20

## Overview

Implement end-to-end payments with Lemon Squeezy including secure webhook verification, subscription state syncing, entitlement checks, a purchase flow with test mode, and basic usage tracking with quota enforcement.

## User Stories

### Keep subscription state in sync

As an operator, I want webhooks from Lemon Squeezy to securely update subscription status so that users immediately gain or lose access based on their payment state.

Detailed workflow: Verify webhook signatures, parse lifecycle events, and upsert subscription records to reflect active, past_due, canceled, or expired states.

### Enable a simple, testable purchase flow

As a user, I want a straightforward checkout that redirects me to Lemon Squeezy and supports test mode so that I can purchase a plan and access gated features without friction.

Detailed workflow: A server action or endpoint creates a checkout session via the payments port and redirects the user to the hosted checkout URL; test mode is toggled via env.

### Enforce entitlements and quotas

As a developer, I want a single helper to check entitlements and enforce usage quotas so that gated features are easy to protect and cannot exceed plan limits.

Detailed workflow: A shared helper reads subscription status and usage counters to allow or block actions, incrementing usage when allowed.

## Spec Scope

1. **Webhook handling with signature verification** - Accept Lemon Squeezy webhooks, verify HMAC signature using the signing secret, and process relevant events idempotently.
2. **Subscription synchronization and entitlement checks** - Update subscription state and provide a helper to check whether a user is entitled to features based on plan/status.
3. **Purchase flow with test mode** - Server-side function to create a checkout and redirect to Lemon Squeezy; supports sandbox/test configuration via environment variables.
4. **Usage tracking and quota enforcement** - Utilities to increment and validate usage against plan limits using existing `usage_counters` data.
5. **Validation and logging** - Input validation, structured logging, and safe failure modes (e.g., 2xx response to valid webhooks, 401 on signature failure).

## Out of Scope

- Complex pricing pages or plan management UI beyond a basic checkout trigger.
- Refunds, proration, coupons, trials configuration UI, and tax/VAT configuration.
- Multi-tenant billing or multiple providers (Stripe, Paddle); focus is Lemon Squeezy only.
- Email receipt templates and deliverability work (handled by the email abstraction).

## Expected Deliverable

1. A secure webhook endpoint that verifies signatures and updates subscription state; unit tests cover signature verification and event handling logic.
2. A purchase flow that returns a valid checkout URL in test mode; integration/E2E test asserts redirection and basic success path.
3. Entitlement and quota helpers with unit tests; a demo-gated route or action that uses them to permit/deny access.
