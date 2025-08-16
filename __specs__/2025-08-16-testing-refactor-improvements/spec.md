# Spec Requirements Document

> Spec: Testing Refactor and Quality Improvements Created: 2025-08-16

## Overview

Refactor the existing test suite to eliminate duplication, improve maintainability, and establish
proper separation of concerns between database testing (pgTAP) and application testing (Vitest).
This refactor will create a higher-quality test suite that follows testing best practices and
reduces flakiness.

## User Stories

### Database Administrator Story

As a database administrator, I want all RLS policies, triggers, and SQL functions to be tested
exclusively through pgTAP, so that I can validate database security and logic independently of
application code.

The complete separation will allow for faster database validation during CI, clearer responsibility
boundaries, and prevention of test duplication that leads to maintenance overhead and flakiness.

### Frontend Developer Story

As a frontend developer, I want application tests to focus only on user-visible behavior and
integration flows, so that I can verify UI functionality without redundantly testing database
constraints.

This approach ensures tests remain stable when database implementation details change, while still
validating that the correct user experience is delivered when authorization fails or succeeds.

### DevOps Engineer Story

As a DevOps engineer, I want a CI pipeline that runs database tests first (fail-fast) followed by
application tests, so that infrastructure issues are caught early and expensive application test
runs are avoided when database contracts are broken.

The two-phase approach with pgTAP validation before app tests will reduce CI time and provide
clearer failure attribution.

## Spec Scope

1. **pgTAP Database Test Suite** - Create comprehensive SQL-based tests for all RLS policies,
   triggers, and database functions using pgTAP framework
2. **Application Test Refactor** - Remove database security testing from Vitest suites and focus on
   user-facing behavior and integration flows
3. **Test Data Management** - Replace hardcoded test data with dynamically generated unique
   identifiers to prevent test collisions
4. **Storage Test Cleanup** - Remove tests that validate Supabase platform limits and focus only on
   application-specific storage logic

## Out of Scope

- Rewriting tests that are already working correctly and follow proper separation of concerns
- Adding new test coverage for untested features
- Performance testing or load testing
- End-to-end testing improvements (Playwright tests remain unchanged)

## Expected Deliverable

1. A complete pgTAP test suite in `supabase/tests/` that validates all database security and logic
   independently
2. Refactored Vitest application tests that focus exclusively on user-visible behavior without
   duplicating database validation
