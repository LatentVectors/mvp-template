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

- [x] 3. Implement pgTAP Tests for SQL Functions and Triggers
  - [x] 3.1 Write tests for `get_user_file_path` function with various inputs
  - [x] 3.2 Write tests for `validate_user_file_path` function edge cases
  - [x] 3.3 Write tests for timestamp update triggers (created_at/updated_at behavior)
  - [x] 3.4 Write tests for any other custom SQL functions or stored procedures
  - [x] 3.5 Verify all SQL function tests pass

- [x] 4. Refactor Application Tests - Remove Database Security Testing
  - [x] 4.2 Remove RLS policy assertions from `apps/web/tests/db/rls.test.ts`
  - [x] 4.3 Remove database constraint testing from `apps/web/tests/db/schema.test.ts`
  - [x] 4.4 Remove storage policy testing from `apps/web/tests/storage/bucket-operations.test.ts`
  - [x] 4.5 Remove database security assertions from
        `apps/web/tests/integration/database-operations.test.ts`
  - [x] 4.6 Verify refactored application tests still pass and focus on UI/integration behavior

- [x] 5. Fix Hardcoded Test Data and Improve Test Isolation
  - [x] 5.1 Write tests for dynamic test data generation utilities generation
  - [x] 5.5 Replace hardcoded emails in `database-operations.test.ts` with dynamic generation
  - [x] 5.6 Verify all tests maintain proper isolation and cleanup

- [x] 6. Remove Platform Testing Anti-Patterns from Storage Tests
  - [x] 6.2 Remove all file size limit tests that validate Supabase platform behavior
  - [x] 6.3 Remove all bucket quota and storage limit tests that test Supabase internals
  - [x] 6.4 Remove memory-intensive large file upload tests (>1MB) completely
  - [x] 6.5 Focus remaining storage tests only on application-specific logic (path validation, user
        authorization)
  - [x] 6.6 Verify storage tests only validate application code, not platform behavior

- [x] 7. Fix SEO and Content Tests to Test Real Code
  - [x] 7.2 Refactor `apps/web/tests/seo/metadata.test.ts` to test actual `generateMetadata`
        functions
  - [x] 7.3 Refactor `apps/web/tests/seo/open-graph.test.ts` to test actual OG route handler
  - [x] 7.4 Refactor `apps/web/tests/seo/sitemap.test.ts` to validate real sitemap configuration
  - [x] 7.5 Refactor `apps/web/tests/lib/content-utils.test.ts` to import and test real utility
        functions
  - [x] 7.6 Verify all SEO and content tests validate actual production code

- [x] 8. Fix Content Layer and Type Generation Tests
  - [x] 8.1 Write fixture-based tests for contentlayer validation
  - [x] 8.2 Replace conditional test logic in `apps/web/tests/content/contentlayer.test.ts` with
        fixture-driven assertions
  - [x] 8.3 Replace conditional test logic in `apps/web/tests/content/mdx-processing.test.ts` with
        fixture-driven assertions
  - [x] 8.4 Remove anti-pattern type generation runtime tests (testing another project)
  - [x] 8.5 Create representative content fixtures with GFM features for testing
  - [x] 8.6 Verify content and type tests provide meaningful validation

- [x] 9. Improve Timestamp and Trigger Testing Reliability
  - [x] 9.1 Write tests for reliable timestamp testing patterns
  - [x] 9.2 Increase timestamp update wait times from 100ms to 300-500ms in trigger tests
  - [x] 9.3 Implement inequality-based timestamp assertions instead of greater-than comparisons
  - [x] 9.4 Add secondary column updates to verify timestamp trigger behavior
  - [x] 9.5 Verify timestamp tests are reliable and not subject to clock skew issues

- [x] 10. Final Validation and Integration Testing
  - [x] 10.1 Run complete pgTAP test suite to verify all database testing works independently
  - [x] 10.2 Run complete application test suite to verify proper separation of concerns
  - [x] 10.3 Verify no test duplication exists between pgTAP and application tests
  - [x] 10.4 Validate that all original test coverage is maintained through the refactor
  - [x] 10.5 Verify all tests pass and testing quality improvements are achieved
