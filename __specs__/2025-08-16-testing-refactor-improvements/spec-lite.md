# Spec Summary (Lite)

Refactor the test suite to eliminate duplication between database and application testing by moving
all RLS, policy, and SQL function validation to pgTAP while focusing Vitest tests on user-visible
behavior. Remove anti-pattern tests that validate third-party platform behavior (Supabase storage
limits). This creates a cleaner separation of concerns, reduces test flakiness, and improves overall
test quality and maintainability.
