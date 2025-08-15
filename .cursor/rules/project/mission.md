# Product Mission

## Pitch

MVP Template is a reusable monorepo template that helps developers ship production-ready MVPs (landing, blog, gated app) in a day by providing a minimal-cost, low-boilerplate foundation with built-in authentication, payments, and deployment automation.

## Users

### Primary Customers

- **Solo Developers & Indie Hackers**: Individual developers building multiple SaaS products who need to move fast from idea to market
- **Small Development Teams**: 2-5 person teams at startups or agencies who want to standardize their MVP development process
- **Technical Founders**: Non-technical founders with basic development skills who want to prototype and validate ideas quickly

### User Personas

**Alex the Indie Hacker** (28-35 years old)
- **Role:** Full-stack Developer / Solo Entrepreneur
- **Context:** Building multiple SaaS products, working evenings/weekends, limited budget
- **Pain Points:** Spending weeks on boilerplate setup, repeating the same auth/payment integration work, deployment complexity
- **Goals:** Ship MVPs in days not weeks, reuse infrastructure across projects, focus on product features not plumbing

**Sarah the Startup CTO** (30-40 years old)
- **Role:** Technical Co-founder / CTO
- **Context:** Leading a small team, need to move fast, limited engineering resources
- **Pain Points:** Team spending too much time on infrastructure, inconsistent project setups, scaling development processes
- **Goals:** Standardize development workflow, reduce time-to-market, enable team to focus on business logic

## The Problem

### Repetitive MVP Setup Tax

Every new SaaS project requires the same 2-3 weeks of boilerplate setup: authentication, database schema, payment processing, deployment pipelines, legal pages, and basic monitoring. This "setup tax" delays validation and burns through runway.

**Our Solution:** Pre-built, production-ready template that handles all common MVP requirements out-of-the-box.

### Infrastructure Fragmentation Across Projects

Developers end up with different tech stacks, deployment processes, and architectural patterns across projects, making maintenance and knowledge transfer difficult. Each project becomes a unique snowflake.

**Our Solution:** Standardized, opinionated stack with clear conventions that works across multiple product ideas.

### Premature Complexity vs. Production Readiness

Most developers either start with toy setups that break in production or over-engineer from day one. Finding the right balance between speed and production-readiness is difficult.

**Our Solution:** Battle-tested architecture that scales from MVP to production without major refactoring.

## Differentiators

### Reusability-First Design

Unlike single-project templates or complex enterprise frameworks, we provide a monorepo structure specifically designed for building multiple MVPs. Share infrastructure providers (email domain, feedback forms) and packages across projects while maintaining clear boundaries.

### Zero-Infrastructure Management

Unlike custom DevOps setups or complex containerization, we use managed services (Vercel, Supabase, Cloud Run) with simple deployment scripts. Developers focus on product features, not infrastructure.

### Schema-First Development

Unlike hand-written types or ORM-first approaches, we use database migrations as the single source of truth with automatic type generation. This ensures type safety without the maintenance overhead of keeping types in sync.

## Key Features

### Core Features

- **One-Day Setup**: Complete MVP infrastructure ready in hours, not weeks
- **Authentication & Authorization**: Supabase-powered auth with RLS policies and feature gating
- **Payment Processing**: Lemon Squeezy integration with webhook handling and subscription management
- **Database Schema Management**: SQL-first migrations with automatic TypeScript/Python type generation
- **Static Site Generation**: Next.js-powered marketing site with blog and SEO optimization

### Development Features

- **Type Safety**: End-to-end TypeScript with generated types from database and API schemas
- **Infrastructure Abstractions**: Swappable providers for storage, email, payments, and analytics
- **Deployment Automation**: CI/CD pipelines for web (Vercel) and services (Cloud Run)
- **Testing Framework**: Playwright E2E tests covering critical user journeys
- **Development Tools**: Hot reload, linting, formatting, and type checking configured

### Compliance Features

- **Legal Pages**: Privacy Policy, Terms of Service, and Cookie Policy templates
- **GDPR Compliance**: Cookie consent banner with Consent Mode v2 integration
- **Security Headers**: Production-ready security configuration
- **Error Tracking**: Sentry integration for monitoring and alerting
- **Data Protection**: Environment-based secrets management and RLS policies
