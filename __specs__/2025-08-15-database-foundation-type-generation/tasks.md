# Spec Tasks

## Tasks

- [x] 1. Supabase Project Setup & CLI Configuration
  - [x] 1.1 Install Supabase CLI and configure local development environment
  - [x] 1.2 Create development Supabase project with proper region selection
  - [x] 1.3 Create production Supabase project with backup configuration
  - [x] 1.4 Configure local Supabase initialization and link projects
  - [x] 1.5 Verify CLI connection and project access for both environments

- [x] 2. Database Schema Implementation
  - [x] 2.1 Create migration file 0001_init.sql with baseline tables (profiles, subscriptions,
        usage_counters)
  - [x] 2.2 Add proper foreign key relationships, constraints, and indexes
  - [x] 2.3 Implement updated_at timestamp triggers for all tables
  - [x] 2.4 Create migration file 0002_policies.sql with Row Level Security policies
  - [x] 2.5 Apply migrations to development environment and verify schema
  - [x] 2.6 Apply migrations to production environment

- [ ] 3. Storage Bucket Configuration
  - [ ] 3.1 Create migration file 0003_storage.sql for storage bucket setup
  - [ ] 3.2 Implement user-files bucket with organized path conventions
  - [ ] 3.3 Configure RLS policies for storage bucket access control
  - [ ] 3.4 Test file upload/download with proper user isolation
  - [ ] 3.5 Verify storage security policies prevent unauthorized access

- [ ] 4. Workspace & Package Configuration
  - [ ] 4.1 Create packages/types workspace with package.json and tsconfig.json
  - [ ] 4.2 Add Supabase dependencies to apps/web/package.json
  - [ ] 4.3 Add @repo/types dependency to web app package.json
  - [ ] 4.4 Add database management scripts to root package.json
  - [ ] 4.5 Update .gitignore with Supabase-specific patterns

- [ ] 5. Supabase Client Integration
  - [ ] 5.1 Create apps/web/lib/supabase/client.ts browser client
  - [ ] 5.2 Create apps/web/lib/supabase/server.ts server client with service role
  - [ ] 5.3 Create environment file structure (.env.local, .env.example)
  - [ ] 5.4 Configure workspace TypeScript paths for @repo/types imports
  - [ ] 5.5 Verify client creation and environment variable loading

- [ ] 6. Type Generation Pipeline
  - [ ] 6.1 Create scripts/typegen-supabase.mjs for automated type generation
  - [ ] 6.2 Generate initial TypeScript types from database schema
  - [ ] 6.3 Test type generation script with npm run typegen:supabase
  - [ ] 6.4 Verify generated types are properly exported from packages/types
  - [ ] 6.5 Confirm types can be imported in web app without errors

- [ ] 7. Development Seed Data
  - [ ] 7.1 Create supabase/seed/seed.sql with development test data
  - [ ] 7.2 Implement idempotent seed data insertion logic
  - [ ] 7.3 Add sample users, subscriptions, and usage counter records
  - [ ] 7.4 Test seed data application in development environment
  - [ ] 7.5 Document seed data usage and reset procedures

- [ ] 8. Integration Testing & Validation
  - [ ] 8.1 Write tests for database schema validation and constraints
  - [ ] 8.2 Test RLS policies with different user contexts and access patterns
  - [ ] 8.3 Validate type generation produces accurate TypeScript definitions
  - [ ] 8.4 Test storage bucket operations with proper access controls
  - [ ] 8.5 Verify all database operations work correctly with generated types
  - [ ] 8.6 Confirm all tests pass and schema meets requirements
