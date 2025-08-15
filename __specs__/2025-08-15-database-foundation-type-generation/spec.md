# Spec Requirements Document

> Spec: Database Foundation & Type Generation Created: 2025-08-15

## Overview

Establish Supabase as the primary data layer with baseline schema, type generation pipeline, and
storage configuration. This foundation enables all subsequent authentication, payment, and
application features with schema-first development patterns.

## User Stories

### Database Administrator Story

As a developer, I want to define database schema through SQL migrations only, so that I maintain a
single source of truth and can generate TypeScript types automatically.

The developer creates migration files in `supabase/migrations/` using ascending numbered files
(0001*, 0002*, etc.). Each migration is idempotent and can be applied safely. The schema includes
baseline tables for users, subscriptions, and usage tracking that will support authentication and
billing features in later phases.

### Type Safety Story

As a frontend developer, I want automatically generated TypeScript types from the database schema,
so that I can build type-safe applications without manual type definitions.

The developer runs a single command to regenerate types whenever the database schema changes. These
types are used throughout the Next.js application for Supabase client calls, ensuring compile-time
safety and preventing runtime errors from schema mismatches.

### Storage Management Story

As an application user, I want secure file storage capabilities, so that I can upload and access
files with proper access controls.

The system provides storage buckets with row-level security policies that automatically handle user
isolation. Files are organized with consistent path conventions and metadata tracking for future
application features.

## Spec Scope

1. **Supabase Project Setup** - Create development and production Supabase projects with proper
   configuration
2. **Baseline Schema Migrations** - Implement core tables (users, subscriptions, usage_counters)
   with foreign key relationships
3. **Row Level Security (RLS)** - Configure security policies for client-side data access with user
   isolation
4. **Storage Bucket Configuration** - Set up file storage with security policies and path
   conventions
5. **Type Generation Pipeline** - Automate TypeScript type generation from database schema
6. **Supabase CLI Integration** - Configure local development workflow with schema management

## Out of Scope

- Authentication implementation (Phase 4)
- Payment processing integration (Phase 6)
- Agent API database access (Phase 8)
- Production environment secrets management (Phase 13)

## Expected Deliverable

1. Functional Supabase projects with baseline schema and storage
2. Automated type generation command that produces accurate TypeScript types
3. RLS policies that properly isolate user data for client-side access
