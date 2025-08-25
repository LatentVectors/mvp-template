### **Authoritative Guide: Integrating Lemon Squeezy Billing**

This document outlines the complete architecture and implementation strategy for adding Lemon Squeezy subscriptions to a Next.js application hosted on Vercel with a Supabase backend.

#### **1. Core Architecture & Technology Stack**

- **Hosting & Platform:** Vercel
- **Backend & Auth:** Supabase (Auth and Postgres Database)
- **Frontend:** Next.js (with API Routes for backend logic)
- **Billing Provider:** Lemon Squeezy
- **Asynchronous Task Queue:** Upstash QStash (for webhook processing)
- **Scheduled Jobs:** Vercel Cron Jobs (for data reconciliation and cleanup)
- **Error Monitoring:** Sentry
- **Key SDKs & Libraries:**
  - **Backend:** The official Lemon Squeezy Node.js client (`@lemonsqueezy/lemonsqueezy.js`).
  - **Frontend:** The official Lemon Squeezy JavaScript library (`lemonsqueezy.js`).

#### **2. Development Workflow & Environment Management**

- **Lemon Squeezy Stores:** Two separate Lemon Squeezy stores will be maintained:
  1.  **Production Store:** The live store for real customer transactions.
  2.  **Test Store:** A single, shared store in "Test Mode" for all development.
- **Environment Variables:** The application will be configured with distinct sets of environment variables:
  - `.env.local` (Local Development): Contains API keys and webhook secrets for the **Test Store**.
  - **Vercel Preview Environment:** Configured to use the **Test Store** keys.
  - **Vercel Production Environment:** Configured to use the **Production Store** keys.
- **Plan Sync & Webhook Management:**
  - **Product creation:** The Lemon Squeezy API does not support creating products/variants. Create and manage all products and variants directly in the Lemon Squeezy dashboard.
  - **Plan sync (read-only cache):** A server-side job fetches products/variants via `@lemonsqueezy/lemonsqueezy.js` and upserts them into a local `plans` table. Trigger this via a protected API route (`/api/cron/sync-plans`) on a schedule.
  - **Further details:** See `__specs__/2025-08-20-payment-integration-subscription-management/sub-specs/product-creation-spec.md` for the `plans` schema, sync algorithm, and how the pricing UI consumes this data.
  - **Webhook management:** Use SDK webhook methods (`createWebhook`, `updateWebhook`, `deleteWebhook`, `listWebhooks`) to programmatically manage the webhook endpoint, ensuring the correct URL and signing secret are configured per environment.

#### **3. Database Schema Design (Supabase Postgres)**

- **`profiles` Table:** Linked one-to-one with `auth.users`.
  - `id` (UUID, Foreign Key to `auth.users.id`): Primary key.
  - `ls_customer_id` (TEXT, Nullable): The permanent Lemon Squeezy customer ID.

- **`subscriptions` Table:** Stores the state of user entitlements.
  - `id` (UUID): Primary key.
  - `user_id` (UUID, Foreign Key to `profiles.id`): Links the subscription to a user.
  - `ls_subscription_id` (TEXT, Unique): The Lemon Squeezy subscription ID.
  - `status` (TEXT): The current status (e.g., `active`, `on_trial`, `past_due`, `cancelled`, `expired`, `paused`).
  - `ls_variant_id` (TEXT): Lemon Squeezy Variant ID for the subscribed plan (FK → `plans.ls_variant_id`).
  - `renews_at` (TIMESTAMP): The next renewal date.
  - `ends_at` (TIMESTAMP, Nullable): Expiration date for cancelled subscriptions.
  - `trial_ends_at` (TIMESTAMP, Nullable): Trial end date.
  - `metadata` (JSONB, Nullable): Stores variant metadata.
  - `card_brand` (TEXT, Nullable): Payment card brand.
  - `card_last_four` (TEXT, Nullable): Payment card's last four digits.
  - Recommendation: Enforce one active subscription per user via `UNIQUE(user_id)` if single-subscription model is desired.

- **`processed_webhooks` Table:** Ensures idempotency.
  - `event_id` (TEXT, PRIMARY KEY): The unique ID of the webhook event.
  - `created_at` (TIMESTAMP): Timestamp of when the event was processed.

- **`plans` Table (read-only cache):** Synchronized copy of Lemon Squeezy variants used to drive pricing and checkout.
  - Populated by the scheduled sync job described in Section 2 and Section 9.
  - See `__specs__/2025-08-20-payment-integration-subscription-management/sub-specs/product-creation-spec.md` for full schema and sync details.
  - RLS: Allow public `select` for anonymous users over `plans` where `is_public = true AND status = 'active'`.

#### **4. User Onboarding & Freemium Flow**

**Unified Signup (Freemium) – User Journey**

1.  **Landing Page:** Users see the `Free`, `Basic`, and `Pro` plans. Each card has a "Sign Up" button.
2.  **Single Funnel:** Regardless of which "Sign Up" is clicked, all routes lead to `'/signup'`.
3.  **Frictionless Signup:** User enters email + password only (Supabase Auth).
4.  **Email Confirmation:** User verifies email and returns to the app.
5.  **Onboarding:** After confirmation, user is authenticated and guided through a brief setup flow.
6.  **Dashboard Access:** User lands on their dashboard on the `Free` tier by default with starting credits visible.
7.  **In‑App Experience:** The credit balance is shown prominently with a clear `Upgrade` button in navigation.
8.  **Upgrade Decision:** When they need more credits or premium features, they click `Upgrade`.
9.  **Checkout:** They are taken to the in‑app pricing page (driven by the `plans` table) or directly to Lemon Squeezy checkout; upon selection, we create a checkout and open it via `lemonsqueezy.js` overlay (see Section 5 and Section 13).
10. **Activation:** On successful payment, webhooks update the subscription; the dashboard immediately reflects the new plan and refreshed credits.

**Technical Implementation Notes**

1.  **Profile Creation:** A database trigger on `auth.users` creates a corresponding row in `profiles`.
2.  **Grant Free Credits:** The trigger initializes default values (e.g., `usage_credits`) for all new users.
3.  **Default Entitlement:** New users are considered `Free` until a Lemon Squeezy subscription is created via checkout (no paid `subscriptions` row is required for `Free`).
4.  **Usage Tracking & Upgrade Prompt:** Protected APIs decrement `usage_credits`. When depleted, paid features are gated and the UI surfaces `Upgrade`.
5.  **Pricing Data Source:** The pricing page is powered by the locally cached `plans` table (synced from Lemon Squeezy; see Section 3 and the product creation spec).
6.  **Checkout:** Backend creates the checkout using `@lemonsqueezy/lemonsqueezy.js` and returns a URL; frontend opens it with `window.LemonSqueezy.Url.Open(...)`.
7.  **Post‑Purchase State:** The `/welcome` page shows an optimistic state and polls `/api/user/subscription-status` until webhooks (Section 6, 14) finalize entitlements.

#### **5. Subscription Checkout Flow**

1.  **Frontend Setup:** The `lemonsqueezy.js` script will be loaded globally in the root app layout at `apps/web/src/app/layout.tsx` so `window.LemonSqueezy` is available everywhere.
2.  **Initiate Checkout:** When a user clicks "Upgrade," the frontend calls a Next.js API route. This route will:
    - Import and use the **Lemon Squeezy Node.js SDK**.
    - Call the `createCheckout` method, passing `storeId` (from `LEMON_SQUEEZY_STORE_ID`), the selected `variant_id` (from the `plans` table), `redirect_url` and `cancel_url` (e.g., `${APP_URL}/welcome?status=success` and `${APP_URL}/pricing?status=cancelled`), and the Supabase `user_id` in `checkout_data.custom`.
    - Return the generated checkout URL to the frontend.
3.  **Open Checkout Overlay:** The frontend receives the URL and uses `window.LemonSqueezy.Url.Open(checkoutUrl)` to open the modal.
4.  **Post-Purchase Redirect & Race Condition Handling:**
    - Upon success, the user is redirected to the `/welcome?status=success` page.
    - This page displays an "Optimistic UI" state.
    - The client-side code polls a `/api/user/subscription-status` endpoint until it confirms the database has been updated by the webhook.

#### **6. Webhook Handling Architecture (via QStash)**

1.  **Public Receiver Endpoint (`/api/webhooks/lemonsqueezy/receive`):**
    - **Signature Verification:** Validate the webhook signature per Lemon Squeezy docs using `LEMON_SQUEEZY_WEBHOOK_SECRET`. In Next.js route handlers, read the raw body via `await req.text()` in a Node runtime and compute an HMAC SHA256; compare with `X-Signature` using a timing-safe comparison. Wrap in `try/catch` to handle invalid signatures.
    - **Enqueuing:** Upon successful verification, it forwards the raw, verified payload to Upstash QStash.
    - **Response:** It immediately returns a `200 OK` response.

2.  **Internal Processor Endpoint (`/api/webhooks/lemonsqueezy/process`):**
    - **Security:** Protected by a secret bearer token; only accepts calls from QStash.
    - **Verify QStash signatures using `QSTASH_CURRENT_SIGNING_KEY`/`QSTASH_NEXT_SIGNING_KEY`.**
    - **Idempotency:** The first step is to `INSERT` the webhook `event_id` into the `processed_webhooks` table. If this fails due to a primary key violation, the function exits successfully.
    - **Logic:** Contains all business logic for updating the `subscriptions` table based on the event payload.
    - **Error Handling:** Returns a `5xx` error on failure to trigger a QStash retry. All errors are logged to Sentry.

#### **7. User Experience for Billing Edge Cases**

- **Payment Failures:**
  - When a `subscription_payment_failed` is received or `subscription_updated` indicates a past-due status, update `subscriptions.status` accordingly.
  - The application logic **immediately restricts access** to paid features.
  - A persistent, non-dismissible in-app banner is displayed, linking the user to the Customer Portal.
- **Checkout Failures:**
  - The frontend will listen for the `Checkout.Error` event from `lemonsqueezy.js` and display a toast notification.

#### **8. Customer Portal Management**

1.  A "Manage Billing" button calls a backend API endpoint.
2.  The endpoint retrieves the Customer Portal URL from the user’s active subscription using the SDK (e.g., `listSubscriptions` filtered by customer); return `attributes.urls.customer_portal`. Define behavior when no active subscription exists (404 with guidance).
3.  The user is redirected to the returned URL (Use `window.LemonSqueezy.Url.Open(...)`).

#### **9. System Robustness & Maintenance**

- **Dead-Letter Queue (DLQ):** A DLQ is configured in Upstash QStash.
- **Automated Alerting:** An automated alert via **Email and Sentry** is configured to fire immediately if a job lands in the DLQ.
- **Cron Job Configuration:** All cron jobs will be defined within the `vercel.json` file at the root of the project repository to ensure they are version-controlled.
  - **Daily Reconciliation Cron Job:** A job defined as `"schedule": "0 5 * * *"` will trigger a protected endpoint (`/api/cron/sync-subscriptions`) to reconcile data between Lemon Squeezy and the local database.
  - **Plans Sync Cron Job:** A job will call `/api/cron/sync-plans` to fetch products/variants from Lemon Squeezy and upsert them into the local `plans` table. See the product creation spec for cadence and implementation details.
  - **Webhook Cleanup Cron Job:** A job will run periodically to delete records from `processed_webhooks` older than 30 days.

#### **10. Data Management & Compliance**

- **User Account Deletion:** The user deletion process is immediate and strict.
  1.  Deletion from Supabase Auth triggers a backend function.
  2.  The function permanently deletes records from the `profiles` and `subscriptions` tables.
  3.  It then uses the **Lemon Squeezy Node.js SDK** to delete or anonymize the customer record in Lemon Squeezy.

#### **11. Code Organization**

- **Singleton Client:** To optimize performance, a singleton instance of the Lemon Squeezy client will be created and reused across all server-side requests. This prevents re-initializing the client on every API call.
- **Billing Logic Isolation:** All interactions with the Lemon Squeezy SDK are contained within `apps/web/src/lib/billing/lemonsqueezy.ts`.
- **Queue Logic Isolation:** All interactions with QStash are contained within `apps/web/src/lib/queue/qstash.ts`.

#### **12. Environment Variables (Explicit)**

- **Naming:** Use full `LEMON_SQUEEZY_` prefixes (no `LS_`).
- **Defined Variables:**
  - `APP_URL`
  - `LEMON_SQUEEZY_API_KEY` (server)
  - `LEMON_SQUEEZY_STORE_ID`
  - `LEMON_SQUEEZY_WEBHOOK_SECRET`
  - `LEMON_SQUEEZY_VARIANT_ID` (single plan) or `LEMON_SQUEEZY_VARIANT_STARTER`, `LEMON_SQUEEZY_VARIANT_PRO` (multi-plan)
  - `QSTASH_TOKEN`
  - `QSTASH_CURRENT_SIGNING_KEY`
  - `QSTASH_NEXT_SIGNING_KEY`
  - `QSTASH_PROCESSOR_BEARER_TOKEN` (protects the internal processor endpoint)
  - `SENTRY_DSN`
- **Environment Separation:**
  - `.env.local` (local dev) and Vercel Preview → Test Store keys
  - Vercel Production → Production Store keys
  - Use separate env files per environment (not different variable names).

#### **13. API Endpoints (Paths + Verbs)**

- `POST /api/billing/checkout` → Returns Lemon Squeezy checkout URL (uses selected `ls_variant_id` from `plans`, `redirect_url`, `cancel_url`, `checkout_data.custom.user_id`).
- `POST /api/billing/portal` → Returns Customer Portal URL using `profiles.ls_customer_id`.
- `GET /api/user/subscription-status` → Returns current entitlement/status for the authenticated user.
- `POST /api/webhooks/lemonsqueezy/receive` → Verifies signature, enqueues verified payload to QStash, responds 200 immediately.
- `POST /api/webhooks/lemonsqueezy/process` → Protected by `QSTASH_PROCESSOR_BEARER_TOKEN`; idempotently applies database updates.
- Cron endpoints:
  - `POST /api/cron/sync-subscriptions` (daily reconciliation)
  - `POST /api/cron/cleanup-webhooks` (delete `processed_webhooks` > 30 days)

#### **14. Webhook Events → Database Mapping**

- **Tables Touched:** `subscriptions`, `profiles` (for `ls_customer_id` as available), `processed_webhooks` (idempotency).
- **Idempotency:** Use the webhook payload's top-level `id` field as the unique event identifier. Insert this value into `processed_webhooks.event_id` and treat unique violations as already processed.
- **Customer Identification:** We will pass `checkout_data.custom = { user_id }` during checkout. Webhooks will read this where available for correlation.
- **Event Handling:**
  - `subscription_created`
    - Set `status`: `on_trial` if trial present, else `active`.
    - Set `variant_id`, `renews_at`, `trial_ends_at`, `metadata` (variant metadata if provided), and `ls_subscription_id`.
    - If customer data present, upsert `profiles.ls_customer_id`.
    - Initialize `card_brand` and `card_last_four` if present.
  - `subscription_updated`
    - Refresh `status` (authoritative from payload), `renews_at`, `ends_at`, `trial_ends_at`, `variant_id`, `metadata`.
    - Update `card_brand`, `card_last_four` if present.
  - `subscription_cancelled`
    - Set `status` = `cancelled`; set `ends_at` from payload.
  - `subscription_resumed`
    - Set `status` = `active`; clear `ends_at` as appropriate; update `renews_at`.
  - `subscription_expired`
    - Set `status` = `expired`; ensure `ends_at` is set.
  - `subscription_paused`
    - Set `status` = `paused`.
  - `subscription_unpaused`
    - Set `status` = `active`; update `renews_at` if provided.
  - `subscription_payment_failed`
    - Set `status` = `past_due`.
  - `subscription_payment_success`
    - Set `status` = `active`; update `card_brand`, `card_last_four` if present.
  - `subscription_payment_recovered`
    - Set `status` = `active`; update `card_brand`, `card_last_four` if present.

#### **15. Lemon Squeezy SDK**

- See `__specs__/2025-08-20-payment-integration-subscription-management/sub-specs/lemon-squeezy-sdk.md` for all available methods in the official Lemon Squeezy SDK.

#### **16. Global lemonsqueezy.js Script Loading**

- The Lemon Squeezy browser script must be globally available. Place the script in the root app layout so it loads for the entire app (not a nested layout like `(public)/layout.tsx`).
- Target: `apps/web/src/app/layout.tsx` (create if not present) and include:

  ```tsx
  import Script from 'next/script'

  // Inside the root layout component
  ;<Script
    src="https://assets.lemonsqueezy.com/lemon.js"
    strategy="afterInteractive"
  />
  ```

#### **17. Inventory Planning**

- Products and variants are defined and managed in the Lemon Squeezy dashboard. Use variant custom metadata to encode application fields (e.g., `{ "access_level": "pro" }`).
- The application syncs these into the local `plans` table via the scheduled `/api/cron/sync-plans` job. See `__specs__/2025-08-20-payment-integration-subscription-management/sub-specs/product-creation-spec.md` for details.

#### **18. Database & Policies Notes**

- `profiles` and `subscriptions` tables exist but may require alignment with the fields listed in Section 3 and Section 14.
- `subscriptions` has RLS; review and update to ensure: owners can read their own, writes occur only via server-side service role.
- `processed_webhooks` does not exist and must be added (primary key `event_id` TEXT, `created_at` TIMESTAMP DEFAULT now()).

#### **19. Access Gating**

- If the user runs out of credits or their subscription is past due, paused, cancelled, expired or otherwise out of free credits and without an active paid subscription all paid features should be immediately locked.

#### **20. Minor Clarifications (Set by Recommendation)**

- **Checkout redirect URLs:**
  - Success: `${APP_URL}/welcome?status=success`
  - Cancel: `${APP_URL}/pricing?status=cancelled`
- **Optimistic UI polling:** poll `/api/user/subscription-status` every 2s up to 60s; show fallback help if still pending.
- **Sentry:** capture all server-side webhook/processor errors; on client, record checkout events as breadcrumbs and include authenticated user context when available.
  - Use 2xx on idempotent duplicates, 4xx on bad signatures (receive), and 5xx on transient errors (process) to trigger retries where appropriate.

#### **21. Example Webhook Payload\***

```json
{
  "meta": {
    "event_name": "subscription_created"
  },
  "type": "subscriptions",
  "id": "1",
  "attributes": {
    "store_id": 1,
    "customer_id": 1,
    "order_id": 1,
    "order_item_id": 1,
    "product_id": 1,
    "variant_id": 1,
    "product_name": "Lemonade",
    "variant_name": "Citrus Blast",
    "user_name": "John Doe",
    "user_email": "johndoe@example.com",
    "status": "active",
    "status_formatted": "Active",
    "card_brand": "visa",
    "card_last_four": "4242",
    "payment_processor": "stripe",
    "pause": null,
    "cancelled": false,
    "trial_ends_at": null,
    "billing_anchor": 12,
    "first_subscription_item": {
      "id": 1,
      "subscription_id": 1,
      "price_id": 1,
      "quantity": 5,
      "created_at": "2021-08-11T13:47:28.000000Z",
      "updated_at": "2021-08-11T13:47:28.000000Z"
    },
    "urls": {
      "update_payment_method": "https://my-store.lemonsqueezy.com/subscription/1/payment-details?expires=1666869343&signature=9985e3bf9007840aeb3951412be475abc17439c449c1af3e56e08e45e1345413",
      "customer_portal": "https://my-store.lemonsqueezy.com/billing?expires=1666869343&signature=82ae290ceac8edd4190c82825dd73a8743346d894a8ddbc4898b97eb96d105a5",
      "customer_portal_update_subscription": "https://my-store.lemonsqueezy.com/billing/1/update?expires=1666869343&signature=e4fabc7ee703664d644bba9e79a9cd3dd00622308b335f3c166787f0b18999f2"
    },
    "renews_at": "2022-11-12T00:00:00.000000Z",
    "ends_at": null,
    "created_at": "2021-08-11T13:47:27.000000Z",
    "updated_at": "2021-08-11T13:54:19.000000Z",
    "test_mode": false
  }
}
```
