# Spec Requirements Document

> Spec: Infrastructure Abstractions & Provider Integration Created: 2025-08-20

## Overview

Implement provider-agnostic ports/adapters for storage, payments, email, and analytics, with default implementations bound via environment-driven configuration. This enables swapping providers without touching feature code and establishes a clean foundation for future integrations.

## User Stories

### Swap providers without code churn

As a developer, I want to depend on small, stable interfaces (ports) so that I can change infrastructure providers (e.g., S3 ↔ Supabase Storage) by changing bindings/config, not feature code.

Detailed workflow: Define minimal TypeScript interfaces in shared packages, implement default adapters, and bind the chosen adapter in the web app using env vars.

### Configure per-environment providers

As an operator, I want provider credentials and options to be managed via environment variables so that staging and production can differ without code changes.

Detailed workflow: Each adapter reads only the variables it needs; the binding layer selects the adapter using a single env variable per capability (storage, payments, email, analytics).

### Verify integrations via automated tests

As a team member, I want automated unit and integration tests that exercise each port (e.g., upload test, optional test email, analytics snippet condition) so that I can validate wiring in any environment without adding app UI.

## Spec Scope

1. **StoragePort + SupabaseStorage adapter** - Define `StoragePort` and provide a Supabase Storage adapter that supports `upload`, `getUrl` (signed), and `delete` with path conventions.
2. **PaymentPort + LemonSqueezy adapter (checkout only)** - Define `PaymentPort` with `createCheckout` and `verifyWebhook` signatures; implement a Lemon Squeezy adapter stub for checkout URL creation. Full webhook processing is out of scope here.
3. **EmailPort + Resend adapter** - Define `EmailPort` with `send` and provide a Resend adapter that sends simple transactional emails from server-only contexts.
4. **AnalyticsPort + GA4 integration** - Define `AnalyticsPort` with `track`/`identify` no-ops on server and a client-side GA4 binding that loads only when configured; Consent Mode wiring point only (banner in a later phase).
5. **Provider configuration & verification** - Env-driven adapter selection validated by automated unit and integration tests for each capability.

## Out of Scope

- Full payment flows and webhook processing, subscription state updates (handled in Phase 6).
- Cookie consent banner and GDPR consent flows (handled in Phase 7).
- Rich email template system and deliverability setup (SPF/DKIM/DMARC assumed configured outside of code).
- Alternative provider implementations (e.g., S3, Stripe, SendGrid, Mixpanel) beyond default adapters.
- Agent service integration or streaming features.

## Expected Deliverable

1. Unit tests cover each port and default adapter; tests pass locally and in CI.
2. An integration test performs a storage upload via `StoragePort` and asserts a signed URL is returned; email tests are conditional and safely no-op when credentials are missing.
3. A component/unit test verifies that the GA snippet renders only when `NEXT_PUBLIC_GA_ID` is set.
