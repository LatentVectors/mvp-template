This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment configuration

Configure these variables in a local `.env` (copy from `.env.example`):

```bash
# Core Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Used server-side only by storage adapter (do not expose to client)
SUPABASE_SERVICE_ROLE_KEY=

# Provider selection (defaults shown)
STORAGE_PROVIDER=supabase
PAYMENTS_PROVIDER=lemonsqueezy
EMAIL_PROVIDER=resend

# Payments: Lemon Squeezy
LEMONSQUEEZY_API_KEY=
# Optionally centralize product config
# LEMONSQUEEZY_STORE_ID=
# LEMONSQUEEZY_VARIANT_ID=

# Email: Resend
RESEND_API_KEY=
EMAIL_FROM="Your Name <no-reply@example.com>"

# Local testing helpers (optional)
SUPABASE_DB_URL=
```

Provider bindings live in `src/lib/providers/{storage,payments,email}.ts` and are server-only. Sensitive SDKs and keys must never be imported in client components.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
