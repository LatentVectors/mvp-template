# Spec Tasks

## Tasks

- [ ] 1. Environment configuration and docs
  - [ ] 1.1 Add/update `.env.example` with required vars
  - [ ] 1.2 Document Test vs Prod store setup and webhook/portal URLs
  - [ ] 1.3 Smoke check environment configuration in local dev

- [ ] 2. SDK client singleton and module organization
  - [ ] 2.1 Create singleton Lemon Squeezy client and queue modules for new code only (`apps/web/src/lib/billing/lemonsqueezy.ts`, `apps/web/src/lib/queue/qstash.ts`)
  - [ ] 2.2 Write tests for singleton initialization and wiring (mock env; no network)
  - [ ] 2.3 Verify all tests pass

- [ ] 3. Database alignment for `subscriptions` and `profiles`
  - [ ] 3.1 Add/align fields and constraints per spec (e.g., `profiles.ls_customer_id`; `subscriptions.{ls_subscription_id,status,ls_variant_id→plans,renews_at,ends_at,trial_ends_at,metadata,card_brand,card_last_four}`; optional `UNIQUE(user_id)`)
  - [ ] 3.2 Update RLS for `subscriptions` (owners read; writes via service role)
  - [ ] 3.3 Write tests for migration and RLS behavior (local DB only; our code only)
  - [ ] 3.4 Verify all tests pass

- [ ] 4. Plans sync job powering pricing/checkout
  - [ ] 4.1 Implement `plans` schema and Supabase policies
  - [ ] 4.2 Implement `listVariants` sync + `/api/cron/sync-plans`
  - [ ] 4.3 Configure `vercel.json` cron for daily sync
  - [ ] 4.4 Write tests for mapper/upsert behavior (mock SDK; no network)
  - [ ] 4.5 Verify all tests pass

- [ ] 5. Implement two-step webhooks (receive → process) with QStash
  - [ ] 5.1 Create `/api/webhooks/lemonsqueezy/receive` (verify HMAC, enqueue to QStash)
  - [ ] 5.2 Create `/api/webhooks/lemonsqueezy/process` (verify QStash, upsert DB, Sentry on error)
  - [ ] 5.3 Create `processed_webhooks` table and apply RLS/retention cleanup
  - [ ] 5.4 Write tests for signature verification and idempotency (mock SDK/QStash; no network)
  - [ ] 5.5 Verify all tests pass

- [ ] 6. Programmatic webhook management via SDK
  - [ ] 6.1 Implement admin utility to create/update webhooks per environment (correct URL, events, signing secret)
  - [ ] 6.2 Write tests for payload building and idempotency (mock SDK; no network)
  - [ ] 6.3 Verify all tests pass

- [ ] 7. Operations: QStash DLQ, cron cleanup, observability
  - [ ] 7.1 Configure DLQ and alert (email + Sentry); ensure Sentry breadcrumbs for checkout/webhook errors
  - [ ] 7.2 Add `/api/cron/cleanup-webhooks` for retention
  - [ ] 7.3 Write tests for cleanup endpoint logic and alert triggers (mock clients; our code only)
  - [ ] 7.4 Verify all tests pass

- [ ] 8. Checkout and customer portal endpoints
  - [ ] 8.1 Create `POST /api/billing/checkout` using `@lemonsqueezy/lemonsqueezy.js`
  - [ ] 8.2 Create `POST /api/billing/portal` to return customer portal URL
  - [ ] 8.3 Write tests for checkout and portal behaviors (mock SDK/browser; our code only)
  - [ ] 8.4 Verify all tests pass

- [ ] 9. Load `lemonsqueezy.js` and integrate overlay checkout
  - [ ] 9.1 Add global script to `apps/web/src/app/layout.tsx` and wire `Url.Open`
  - [ ] 9.2 Write tests to assert overlay invocation (mock `window.LemonSqueezy`; no external calls)
  - [ ] 9.3 Verify all tests pass

- [ ] 10. Subscription status API and entitlement/quota helper
  - [ ] 10.1 Implement `GET /api/user/subscription-status`
  - [ ] 10.2 Implement shared helper for entitlement + usage increment
  - [ ] 10.3 Write tests for entitlement decisions and optimistic polling (mock DB states; our code only)
  - [ ] 10.4 Verify all tests pass

- [ ] 11. Pricing UI consumption of `plans` (public and in-app)
  - [ ] 11.1 Implement pricing page data fetch and `Upgrade` CTA routing
  - [ ] 11.2 Write tests for filtering/sorting and interval toggling (mock `plans` data; no SDK calls)
  - [ ] 11.3 Verify all tests pass

- [ ] 12. Daily subscription reconciliation cron job
  - [ ] 12.1 Implement `POST /api/cron/sync-subscriptions` to reconcile DB with Lemon Squeezy (protected, Sentry on error)
  - [ ] 12.2 Configure `vercel.json` cron schedule
  - [ ] 12.3 Write tests for reconciliation logic (mock SDK/DB; our code only)
  - [ ] 12.4 Verify all tests pass
