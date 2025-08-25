# Spec Summary (Lite)

Implement Lemon Squeezy billing with the official SDKs: overlay checkout via `lemonsqueezy.js`, backend checkout creation with `@lemonsqueezy/lemonsqueezy.js`, and a two-step webhook pipeline (receiver → QStash → processor) with signature verification and idempotency. Sync variants into a local `plans` table to drive pricing/checkout, expose a customer portal endpoint, and enforce entitlements/quotas. Supports test mode across environments.
