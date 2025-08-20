## Roadmap

### Phase 1 — Monorepo Bootstrap & Static Frontend Foundation

- Initialize npm workspaces with Node/Python support
- Create directory structure: `apps/`, `services/`, `packages/`, `supabase/`, `infra/`, `e2e/`, `docs/`
- Bootstrap Next.js 15 with TypeScript, App Router, Tailwind, shadcn/ui
- Implement base layouts, navigation, footer, and theming
- Create static marketing pages (landing page) with responsive design
- Configure linting: ESLint, Prettier (with Tailwind plugin), tsconfig.base, EditorConfig
- Set up basic Vercel deployment for immediate static site deployment

### Phase 2 — Content Management & SEO

- Integrate Contentlayer for MDX blog functionality
- Create legal pages (Privacy Policy, Terms of Service, Cookie Policy) and footer structure
- Implement SEO infrastructure: Metadata API, sitemap, robots, OG images
- Create example blog content and marketing copy
- Deploy fully functional static marketing site with blog

### Phase 3 — Database Foundation & Type Generation

- Create Supabase projects for development and production
- Implement baseline migrations: `users`, `subscriptions`, `usage_counters`, seed data
- Configure Supabase CLI and type generation pipeline
- Set up storage buckets and baseline RLS policies
- Generate TypeScript types from database schema

### Phase 4 — Authentication System

- Configure Resend SMTP with dedicated sending subdomain
- Implement Supabase Auth UI for authentication flows
- Add route protection and user session management
- Create protected app shell and basic dashboard
- Deploy authenticated application functionality

### Phase 5 — Infrastructure Abstractions & Provider Integration

- Implement storage port/adapter pattern with Supabase Storage implementation
- Implement payment port/adapter pattern with Lemon Squeezy integration
- Implement email port/adapter pattern with Resend integration
- Add provider configuration and environment management

### Phase 6 — Payment Integration & Subscription Management

- Implement Lemon Squeezy webhook handlers with signature verification
- Add subscription management and entitlement checking
- Create purchase flow with test mode support
- Implement usage tracking and quota enforcement
- Deploy full payment functionality

### Phase 7 — Analytics, Compliance & Feedback

- Implement GA4 with Consent Mode v2
- Add cookie consent banner with GDPR compliance
- Configure analytics to respect user consent preferences
- Integrate Tally.so feedback collection system
- Add feedback button placement and user context

### Phase 8 — Agent API Service Foundation

- Scaffold FastAPI service with health checks and job management
- Implement Supabase JWT verification and CORS handling
- Add basic agent orchestration and job tracking
- Set up container build and Cloud Run deployment
- Create evaluation framework skeleton

### Phase 9 — Agent Streaming & Real-time Features

- Add SSE streaming for agent events
- Implement real-time job status updates
- Create agent-to-frontend communication protocols
- Add streaming UI components and error handling
- Deploy full agent integration

### Phase 10 — File Storage & Upload Capabilities

- Implement file upload/download capabilities using storage abstraction
- Add file management UI components
- Configure storage security and access controls
- Implement file processing workflows
- Add storage usage tracking

### Phase 11 — Observability & Monitoring

- Configure Sentry for error tracking across web and agent services
- Set up structured logging and PII scrubbing
- Implement uptime monitoring with UptimeRobot
- Add performance monitoring and alerting
- Configure log correlation and debugging tools

### Phase 12 — End-to-End Testing

- Create Playwright test suite for critical user flows
- Configure test environments and test accounts
- Add CI integration for automated testing
- Implement test data management and cleanup
- Add staging environment testing procedures

### Phase 13 — Production Hardening & Environment Management

- Create separate staging and production environments
- Configure environment-specific secrets and variables
- Add staging seed data and testing procedures
- Implement rollback strategies and deployment procedures
- Add production monitoring and alerting
- Document operational procedures and troubleshooting
