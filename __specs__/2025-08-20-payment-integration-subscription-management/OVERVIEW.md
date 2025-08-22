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
  - `.env.local` (Local Development): Contains API keys, webhook secrets, and product variant IDs from the **Test Store**.
  - **Vercel Preview Environment:** Configured to use the **Test Store** keys.
  - **Vercel Production Environment:** Configured to use the **Production Store** keys.
- **"Infrastructure as Code" Seeding Script:**
  - **Location:** A script will be located at `/scripts/sync-lemonsqueezy.ts`.
  - **Execution:** The script will be runnable with an argument to target an environment (e.g., `npm run sync-products -- --store=test`), using the corresponding API keys.
  - **Product Management:** The script reads a local `products.json` file and uses the Lemon Squeezy Node.js SDK to programmatically create/update products and variants, including their metadata (e.g., `{ "access_level": "pro" }`).
  - **Webhook Management:** The script will also use the SDK to programmatically create and manage the webhook endpoint, ensuring the correct URL and signing secret are configured for the target environment.

#### **3. Database Schema Design (Supabase Postgres)**

- **`profiles` Table:** Linked one-to-one with `auth.users`.
  - `id` (UUID, Foreign Key to `auth.users.id`): Primary key.
  - `ls_customer_id` (TEXT, Nullable): The permanent Lemon Squeezy customer ID.

- **`subscriptions` Table:** Stores the state of user entitlements.
  - `id` (UUID): Primary key.
  - `user_id` (UUID, Foreign Key to `profiles.id`): Links the subscription to a user.
  - `ls_subscription_id` (TEXT, Unique): The Lemon Squeezy subscription ID.
  - `status` (TEXT): The current status (e.g., `active`, `past_due`, `cancelled`).
  - `variant_id` (INTEGER): The ID of the specific plan.
  - `renews_at` (TIMESTAMP): The next renewal date.
  - `ends_at` (TIMESTAMP, Nullable): Expiration date for cancelled subscriptions.
  - `trial_ends_at` (TIMESTAMP, Nullable): Trial end date.
  - `metadata` (JSONB, Nullable): Stores variant metadata.
  - `card_brand` (TEXT, Nullable): Payment card brand.
  - `card_last_four` (TEXT, Nullable): Payment card's last four digits.

- **`processed_webhooks` Table:** Ensures idempotency.
  - `event_id` (TEXT, PRIMARY KEY): The unique ID of the webhook event.
  - `created_at` (TIMESTAMP): Timestamp of when the event was processed.

#### **4. User Onboarding & Freemium Flow**

1.  **New User Signup:** A user signs up via Supabase Auth.
2.  **Profile Creation:** A Supabase Database Trigger on `auth.users` creates a corresponding row in the `profiles` table.
3.  **Granting Free Credits:** The trigger sets default values in the new `profiles` row, including populating a `usage_credits` column.
4.  **Usage Tracking & Upgrade Prompt:** Protected API routes that gate billable actions will contain the logic to decrement the `usage_credits` in the database. When the count reaches zero, the UI will lock the features and display an "Upgrade" prompt.

#### **5. Subscription Checkout Flow**

1.  **Frontend Setup:** The `lemonsqueezy.js` script will be loaded globally in the application, for example, within the `pages/_document.tsx` file, to make the `window.LemonSqueezy` object available everywhere.
2.  **Initiate Checkout:** When a user clicks "Upgrade," the frontend calls a Next.js API route. This route will:
    - Import and use the **Lemon Squeezy Node.js SDK**.
    - Call the `createCheckout` method, passing the `variant_id` (from environment variables), a `redirect_url` (`https://yourapp.com/welcome?status=success`), and the Supabase `user_id` in the `checkout_data.custom` field.
    - Return the generated checkout URL to the frontend.
3.  **Open Checkout Overlay:** The frontend receives the URL and uses `window.LemonSqueezy.Url.Open(checkoutUrl)` to open the modal.
4.  **Post-Purchase Redirect & Race Condition Handling:**
    - Upon success, the user is redirected to the `/welcome?status=success` page.
    - This page displays an "Optimistic UI" state.
    - The client-side code polls a `/api/user/subscription-status` endpoint until it confirms the database has been updated by the webhook.

#### **6. Webhook Handling Architecture (via QStash)**

1.  **Public Receiver Endpoint (`/api/webhooks/lemonsqueezy/receive`):**
    - **Signature Verification:** This endpoint will use the `verifyEvent()` utility from the **Lemon Squeezy Node.js SDK**. It will wrap this call in a `try/catch` block to handle invalid signatures.
    - **Enqueuing:** Upon successful verification, it forwards the raw, verified payload to Upstash QStash.
    - **Response:** It immediately returns a `200 OK` response.

2.  **Internal Processor Endpoint (`/api/webhooks/lemonsqueezy/process`):**
    - **Security:** Protected by a secret bearer token; only accepts calls from QStash.
    - **Idempotency:** The first step is to `INSERT` the webhook `event_id` into the `processed_webhooks` table. If this fails due to a primary key violation, the function exits successfully.
    - **Logic:** Contains all business logic for updating the `subscriptions` table based on the event payload.
    - **Error Handling:** Returns a `5xx` error on failure to trigger a QStash retry. All errors are logged to Sentry.

#### **7. User Experience for Billing Edge Cases**

- **Payment Failures:**
  - When a `subscription_past_due` webhook is received, the `subscriptions.status` is updated.
  - The application logic **immediately restricts access** to paid features.
  - A persistent, non-dismissible in-app banner is displayed, linking the user to the Customer Portal.
- **Checkout Failures:**
  - The frontend will listen for the `Checkout.Error` event from `lemonsqueezy.js` and display a toast notification.

#### **8. Customer Portal Management**

1.  A "Manage Billing" button calls a backend API endpoint.
2.  The endpoint uses the **Lemon Squeezy Node.js SDK's** `createCustomerPortalUrl` method, passing the user's `ls_customer_id` retrieved from the `profiles` table.
3.  The user is redirected to the generated signed URL.

#### **9. System Robustness & Maintenance**

- **Dead-Letter Queue (DLQ):** A DLQ is configured in Upstash QStash.
- **Automated Alerting:** An automated alert via **Email and Sentry** is configured to fire immediately if a job lands in the DLQ.
- **Cron Job Configuration:** All cron jobs will be defined within the `vercel.json` file at the root of the project repository to ensure they are version-controlled.
  - **Daily Reconciliation Cron Job:** A job defined as `"schedule": "0 5 * * *"` will trigger a protected endpoint (`/api/cron/sync-subscriptions`) to reconcile data between Lemon Squeezy and the local database.
  - **Webhook Cleanup Cron Job:** A job will run periodically to delete records from `processed_webhooks` older than 30 days.

#### **10. Data Management & Compliance**

- **User Account Deletion:** The user deletion process is immediate and strict.
  1.  Deletion from Supabase Auth triggers a backend function.
  2.  The function permanently deletes records from the `profiles` and `subscriptions` tables.
  3.  It then uses the **Lemon Squeezy Node.js SDK** to delete or anonymize the customer record in Lemon Squeezy.

#### **11. Code Organization**

- **Singleton Client:** To optimize performance, a singleton instance of the Lemon Squeezy client will be created and reused across all server-side requests. This prevents re-initializing the client on every API call.
- **Billing Logic Isolation:** All interactions with the Lemon Squeezy SDK are contained within `/lib/billing/lemonsqueezy.ts`.
- **Queue Logic Isolation:** All interactions with QStash are contained within `/lib/queue/qstash.ts`.
