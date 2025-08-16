# Technical Specification

This is the technical specification for the spec detailed in
@**specs**/2025-08-16-testing-refactor-improvements/spec.md

## Technical Requirements

### pgTAP Test Suite Implementation

- Create `supabase/tests/policies/` directory structure for RLS policy tests
- Create `supabase/tests/functions/` directory structure for SQL function tests
- Implement pgTAP test files using `lives_ok()`/`throws_ok()` pattern with
  `SET LOCAL request.jwt.claims` for user context simulation
- Use `BEGIN;`/`ROLLBACK;` transaction isolation for each test file
- Include `SELECT plan(N);` and `SELECT * FROM finish();` structure in all pgTAP tests

### Application Test Refactoring

- Remove all RLS policy assertions from Vitest test files (`schema.test.ts`, `rls.test.ts`,
  `bucket-operations.test.ts`, `database-operations.test.ts`)
- Replace hardcoded email addresses with dynamic generation using `Date.now()` and
  `crypto.randomUUID()`
- Focus application tests on user-visible outcomes (error messages, UI state) rather than
  enforcement mechanisms
- Maintain test isolation with proper cleanup using captured IDs from test operations

### Storage Test Cleanup

- Remove all tests that validate Supabase storage platform limits (file size limits, bucket quotas,
  etc.)
- Remove memory-intensive large file upload tests that test platform behavior
- Focus storage tests only on application-specific logic (user file path validation, authorization,
  etc.)
- Trust Supabase to enforce their own platform limits correctly

### Test Data Management

- Implement dynamic test data generation patterns across all test files
- Use consistent naming conventions for generated test data
- Ensure all test data includes cleanup mechanisms with captured identifiers
- Remove static test data dependencies that could cause cross-test pollution

### SEO and Content Test Improvements

- Import and test actual metadata generation functions instead of testing local constants
- Mock content layer dependencies with representative fixtures containing GFM features
- Replace conditional test logic with fixture-driven assertions
- Use `expectTypeOf` from Vitest for TypeScript type-level assertions

## External Dependencies

**pgTAP Extension**

- **Purpose**: PostgreSQL unit testing framework for database logic validation
- **Justification**: Industry standard for PostgreSQL testing; enables SQL-native test authoring;
  provides proper isolation for database contract testing

**Vitest expectTypeOf Utility**

- **Purpose**: Type-level assertions for TypeScript testing
- **Justification**: Already included in Vitest; replaces weak runtime type checks with proper
  compile-time validation
