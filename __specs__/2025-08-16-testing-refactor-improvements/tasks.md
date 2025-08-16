# Spec Tasks

## Tasks

- [x]
  1. Setup pgTAP Infrastructure and Database Testing Foundation
  - [x] 1.2 Create `supabase/tests/policies/` directory structure
  - [x] 1.3 Create `supabase/tests/functions/` directory structure
  - [x] 1.4 Add pgTAP test runner to repository tooling (via `npm run test:db`)
  - [x] 1.5 Create sample pgTAP test file with proper transaction isolation pattern
  - [x] 1.6 Verify pgTAP tests can run via `supabase test db`

- [x] 2. Implement pgTAP Tests for RLS Policies
  - [x] 2.1 Write tests for profiles table RLS policies using `SET LOCAL request.jwt.claims`
  - [x] 2.2 Write tests for storage bucket policies and user file path validation
  - [x] 2.3 Write tests for any subscription/usage-related RLS policies
  - [x] 2.4 Create positive and negative test cases using `lives_ok()` and `throws_ok()`
  - [x] 2.5 Verify all RLS scenarios are covered with proper user context simulation
  - [x] 2.6 Verify all pgTAP policy tests pass

- [ ] 3. Implement pgTAP Tests for SQL Functions and Triggers
  - [ ] 3.1 Write tests for `get_user_file_path` function with various inputs
  - [ ] 3.2 Write tests for `validate_user_file_path` function edge cases
  - [ ] 3.3 Write tests for timestamp update triggers (created_at/updated_at behavior)
  - [ ] 3.4 Write tests for any other custom SQL functions or stored procedures
  - [ ] 3.5 Verify all SQL function tests pass

- [ ] 4. Refactor Application Tests - Remove Database Security Testing
  - [ ] 4.2 Remove RLS policy assertions from `apps/web/tests/db/rls.test.ts`
  - [ ] 4.3 Remove database constraint testing from `apps/web/tests/db/schema.test.ts`
  - [ ] 4.4 Remove storage policy testing from `apps/web/tests/storage/bucket-operations.test.ts`
  - [ ] 4.5 Remove database security assertions from
        `apps/web/tests/integration/database-operations.test.ts`
  - [ ] 4.6 Verify refactored application tests still pass and focus on UI/integration behavior

- [ ] 5. Fix Hardcoded Test Data and Improve Test Isolation
  - [ ] 5.1 Write tests for dynamic test data generation utilities
  - [ ] 5.2 Replace hardcoded emails in `schema.test.ts` with dynamic generation
  - [ ] 5.3 Replace hardcoded emails in `rls.test.ts` with dynamic generation
  - [ ] 5.4 Replace hardcoded emails in `bucket-operations.test.ts` with dynamic generation
  - [ ] 5.5 Replace hardcoded emails in `database-operations.test.ts` with dynamic generation
  - [ ] 5.6 Verify all tests maintain proper isolation and cleanup

- [ ] 6. Remove Platform Testing Anti-Patterns from Storage Tests
  - [ ] 6.2 Remove all file size limit tests that validate Supabase platform behavior
  - [ ] 6.3 Remove all bucket quota and storage limit tests that test Supabase internals
  - [ ] 6.4 Remove memory-intensive large file upload tests (>1MB) completely
  - [ ] 6.5 Focus remaining storage tests only on application-specific logic (path validation, user
        authorization)
  - [ ] 6.6 Verify storage tests only validate application code, not platform behavior

- [ ] 7. Fix SEO and Content Tests to Test Real Code
  - [ ] 7.2 Refactor `apps/web/tests/seo/metadata.test.ts` to test actual `generateMetadata`
        functions
  - [ ] 7.3 Refactor `apps/web/tests/seo/open-graph.test.ts` to test actual OG route handler
  - [ ] 7.4 Refactor `apps/web/tests/seo/sitemap.test.ts` to validate real sitemap configuration
  - [ ] 7.5 Refactor `apps/web/tests/lib/content-utils.test.ts` to import and test real utility
        functions
  - [ ] 7.6 Verify all SEO and content tests validate actual production code

- [ ] 8. Fix Content Layer and Type Generation Tests
  - [ ] 8.1 Write fixture-based tests for contentlayer validation
  - [ ] 8.2 Replace conditional test logic in `apps/web/tests/content/contentlayer.test.ts` with
        fixture-driven assertions
  - [ ] 8.3 Replace conditional test logic in `apps/web/tests/content/mdx-processing.test.ts` with
        fixture-driven assertions
  - [ ] 8.4 Refactor `apps/web/tests/types/generation.test.ts` to use `expectTypeOf` for type-level
        assertions
  - [ ] 8.5 Create representative content fixtures with GFM features for testing
  - [ ] 8.6 Verify content and type tests provide meaningful validation

- [ ] 9. Improve Timestamp and Trigger Testing Reliability
  - [ ] 9.1 Write tests for reliable timestamp testing patterns
  - [ ] 9.2 Increase timestamp update wait times from 100ms to 300-500ms in trigger tests
  - [ ] 9.3 Implement inequality-based timestamp assertions instead of greater-than comparisons
  - [ ] 9.4 Add secondary column updates to verify timestamp trigger behavior
  - [ ] 9.5 Verify timestamp tests are reliable and not subject to clock skew issues

- [ ] 10. Final Validation and Integration Testing
  - [ ] 10.1 Run complete pgTAP test suite to verify all database testing works independently
  - [ ] 10.2 Run complete application test suite to verify proper separation of concerns
  - [ ] 10.3 Verify no test duplication exists between pgTAP and application tests
  - [ ] 10.4 Validate that all original test coverage is maintained through the refactor
  - [ ] 10.5 Verify all tests pass and testing quality improvements are achieved
