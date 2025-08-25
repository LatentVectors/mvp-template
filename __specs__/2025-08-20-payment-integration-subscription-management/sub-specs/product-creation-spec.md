Of course. Here is the complete and final overview, updated to clarify the use of the `lemonsqueezy.js` script for an iframe/overlay checkout experience.

---

### **Authoritative Guide: Dynamic Product & Pricing Page Implementation**

This document details the definitive architecture for integrating Lemon Squeezy products into a Next.js application. The workflow uses the Lemon Squeezy dashboard as the single source of truth and a Supabase database as a synchronized, read-only cache to drive a dynamic pricing page.

#### **Core Principle**

- **Single Source of Truth:** The Lemon Squeezy dashboard is the absolute source of truth for all product and plan information, including names, descriptions, prices, intervals, and application-specific metadata.
- **Database as a Cache:** Your Supabase database will store a copy of the plan data. This provides fast, reliable access for your application without needing to call the Lemon Squeezy API on every page load.
- **Synchronization:** Data is synced from Lemon Squeezy to your database via a server-side function, which is run periodically by a cron job.

---

#### **1. Database Schema: The `plans` Table**

A dedicated table in Supabase will store the synchronized plan data, with important metadata fields "unpacked" into dedicated columns for performance and ease of use.

- **Table Name:** `plans`
- **Columns:**
  - `id` (UUID): Standard primary key.
  - `ls_product_id` (TEXT): The Product ID from Lemon Squeezy. Index this column (not unique) since multiple variants share a product.
  - `ls_variant_id` (TEXT, UNIQUE): The Variant ID from Lemon Squeezy. This is the primary key for checkouts and upsert operations.
  - `name` (TEXT): The user-friendly variant name (e.g., "Pro Monthly").
  - `description` (TEXT, Nullable): The variant description.
  - `price` (INTEGER): The price in cents.
  - `interval` (TEXT): The billing interval (e.g., "month", "year").
  - **Unpacked Metadata Columns:**
    - `status` (TEXT, default: 'active'): The status of the plan (e.g., 'active', 'archived').
    - `access_level` (TEXT, NOT NULL): The permission tier this plan grants (e.g., 'free', 'pro').
    - `is_public` (BOOLEAN, default: true): Controls if the plan appears on the main pricing page.
    - `is_featured` (BOOLEAN, default: false): A flag for highlighting a specific plan in the UI.
    - `plan_group` (TEXT, Nullable): A shared key to group related plans (e.g., "pro").
    - `sort_order` (INTEGER, default: 999): An integer to control the display order.
  - **Catch-all Metadata Column:**
    - `metadata` (JSONB, Nullable): Stores the full custom metadata object from the variant for flexibility and future use.

#### **2. Lemon Squeezy Setup: The Control Panel**

All product management is performed in the Lemon Squeezy dashboard.

1.  **Create Products and Variants:** For each plan, create the corresponding products and variants. Fill in the **Name**, **Description**, and **Price** fields as you want them to appear in your application.
2.  **Add Rich Metadata:** This is the most critical step. For each variant, add a complete set of custom metadata to control its behavior in your application.

    **Example Metadata for a "Pro Annual" Variant:**

    ```json
    {
      "access_level": "pro",
      "interval": "year",
      "plan_group": "pro",
      "sort_order": 20,
      "is_featured": true,
      "is_public": true,
      "status": "active"
    }
    ```

#### **3. The Synchronization Logic**

A server-side function keeps your database in sync with Lemon Squeezy.

- **Function (`syncPlans`):** This function, located in your backend logic (e.g., `apps/web/src/lib/billing/lemonsqueezy.ts`), performs the sync.
  1.  **Fetch Live Data:** Uses the Lemon Squeezy SDK's `listVariants` method and paginates through all pages until all variants are fetched.
  2.  **Format Data for Database:** Iterates through the fetched variants and maps them to the structure of your `plans` table, explicitly pulling important metadata into top-level fields.
      ```typescript
      const plansToUpsert = variants.map(variant => {
        const customData = variant.attributes.custom_data || {}
        return {
          ls_product_id: variant.attributes.product_id,
          ls_variant_id: variant.id,
          name: variant.attributes.name,
          description: variant.attributes.description,
          price: variant.attributes.price,
          interval: variant.attributes.interval,
          // Unpack important metadata with sensible defaults
          status: customData.status ?? 'active',
          access_level: customData.access_level ?? 'free', // Default to a safe, non-paying tier
          is_public: customData.is_public ?? true,
          is_featured: customData.is_featured ?? false,
          plan_group: customData.plan_group ?? null,
          sort_order: customData.sort_order ?? 999,
          // Store the full object for future use
          metadata: customData,
        }
      })
      ```
  3.  **Upsert into Supabase:** Uses the Supabase client's `upsert` method with the `onConflict: 'ls_variant_id'` option. This safely creates, updates, and synchronizes your `plans` table.
  4.  **Price & Interval Source of Truth:** Prefer the API-provided attributes for `price` and `interval`. Do not duplicate `interval` in custom metadata if it exists in the API response.

- **Triggering the Sync (Vercel Cron Job):**
  1.  **Create an API Endpoint:** A protected API route (e.g., `/api/cron/sync-plans`) is created to call the `syncPlans()` function.
  2.  **Configure `vercel.json`:** A cron job is defined in `vercel.json` to call this endpoint on a schedule (e.g., once daily).

      ```json
      {
        "crons": [
          {
            "path": "/api/cron/sync-plans",
            "schedule": "0 5 * * *"
          }
        ]
      }
      ```

#### **4. Frontend Implementation: Pricing Display (Public) and In‑App**

- **File Location (App Router):** `apps/web/src/app/(public)/pricing/page.tsx` (or render pricing modules on the landing page)
- **Prerequisite - Script Loading:** Load the `lemonsqueezy.js` script in the root app layout at `apps/web/src/app/layout.tsx` using a Next `<Script>` tag so `window.LemonSqueezy` is globally available.
- **Data Fetching (Server Component or Route Handler):** Fetch on the server to ensure the page always displays the most recently synced data.
  1.  Use the Supabase client to query your `plans` table.
  2.  The query must filter for displayable plans and order them correctly:
      ```typescript
      const { data: plans } = await supabase
        .from('plans')
        .select('*')
        .eq('is_public', true)
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
      ```
  3.  Pass the fetched `plans` array to your pricing component as props.

- **CTA Behavior (Unified Signup):**
  1.  On public pages (landing or public pricing), all plan CTAs route to `'/signup'` (no checkout is initiated at this stage).
  2.  After signup and login, the in‑app `Upgrade` button leads to an authenticated pricing view where users select a plan and proceed to checkout (see Section 6).

#### **5. UI Logic & Component Design**

- **Monthly/Annual Toggle:**
  - Use a React state (`useState`) to manage the selected interval ("month" or "year").
  - In the component, transform the flat `plans` array into an object grouped by the `plan_group` key.
  - The `PricingCard` components will receive the grouped plan data and the currently selected interval, displaying the correct price and details.

- **Highlighting a Plan:**
  - The `PricingCard` component will inspect the `is_featured` boolean property of the plan it receives.
  - It will then conditionally apply a special CSS class (e.g., `.featured`) or render a "Most Popular" badge.

#### **6. In‑App Upgrade Flow (Post‑Signup)**

The checkout process occurs only after the user signs up and is authenticated.

1.  **Trigger (In‑App):** From the dashboard/navigation, the user clicks `Upgrade` and is shown an in‑app pricing UI powered by the `plans` table.
2.  **Plan Selection:** The in‑app pricing view provides `ls_variant_id` for the selected plan.
3.  **API Call:** The frontend makes a `POST` request to `/api/billing/checkout`, sending the chosen `ls_variant_id`.
4.  **Backend API Route (`/api/billing/checkout`):**
    - Authenticates the user via Supabase to get `user_id`.
    - Uses the Lemon Squeezy SDK `createCheckout`, passing `storeId` (from `LEMON_SQUEEZY_STORE_ID`), the selected `variantId` (from the `plans` table), `redirect_url` and `cancel_url` (e.g., `${APP_URL}/welcome?status=success` and `${APP_URL}/pricing?status=cancelled`), and `checkout_data: { custom: { user_id } }`.
    - Returns the secure checkout URL to the frontend.
5.  **Open Checkout Overlay:** The frontend calls **`window.LemonSqueezy.Url.Open(checkoutUrl)`** to open the checkout iframe overlay.
6.  **Activation:** On success, webhooks update `subscriptions`; the UI immediately reflects the upgraded plan and credits (see technical spec Section 4 and Section 14).
