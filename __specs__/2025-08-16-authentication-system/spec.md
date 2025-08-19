# Spec Requirements Document

> Spec: Authentication System Created: 2025-08-16

## Overview

Implement a production-ready authentication system using Supabase Auth and Resend SMTP that enables secure signup, login, email verification, and session management with protected routes and a basic authenticated dashboard.

## User Stories

### Sign up and verify email

As a new visitor, I want to create an account with my email and password and receive a verification email so that I can securely confirm my identity before accessing the app.

Detailed workflow: User submits email/password via auth UI → Supabase sends verification email via Resend SMTP → user clicks link → account is confirmed → app redirects to the protected dashboard.

### Log in and stay signed in

As a returning user, I want to sign in and have my session persist so that I can access my dashboard without re-authenticating on every page view, while still being able to log out when I choose.

Detailed workflow: User logs in via Supabase Auth UI → session cookie is established with rolling refresh (7 days) → protected routes load the app shell/dash when authenticated → logout clears session and redirects to marketing page.

### Block unauthenticated access

As an anonymous visitor, I should be redirected away from protected routes so that only authenticated users can access the app dashboard and gated features.

Detailed workflow: Middleware/guards check session on protected routes → unauthenticated users are redirected to login page with return URL → authenticated users proceed.

## Spec Scope

1. **Resend SMTP configuration** - Configure dedicated sending subdomain with SPF/DKIM/DMARC and wire up Supabase Auth emails through Resend.
2. **Supabase Auth UI integration** - Add `@supabase/auth-ui-react` for signup, login, reset flows with minimal custom UI.
3. **Route protection & session management** - Implement helpers and (optional) middleware to enforce auth on `(app)` routes; ensure 7-day rolling sessions with refresh.
4. **Protected app shell & basic dashboard** - Create authenticated layout and a simple dashboard page that surfaces user identity (e.g., email) and logout control.
5. **Deployment of authenticated flows** - Deploy to Vercel with environment variables configured; verify end-to-end auth flows in production.

## Out of Scope

- Payments, subscriptions, and entitlement checks (covered in later phases)
- Advanced profile model and user settings UI
- Social logins (Google, GitHub, etc.) and MFA
- Admin roles, RBAC, or organization/team features
- SSR/ISR for authenticated routes (use SPA for gated app in MVP)

## Expected Deliverable

1. Users can sign up, receive a verification email, confirm, and then log in successfully. Verification and password reset emails are reliably delivered from the configured sending subdomain.
2. Unauthenticated users are redirected away from protected routes; authenticated users can access the dashboard with a persistent rolling session and can log out.
3. Deployed environment (Vercel) demonstrates the full authentication flow with correct environment variables and no client-side exposure of privileged secrets.
