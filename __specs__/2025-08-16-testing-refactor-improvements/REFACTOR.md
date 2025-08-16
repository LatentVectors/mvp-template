# Test Improvements

### Testing principles and ownership

- Single source of truth for each behavior
  - Any given behavior must be tested in exactly one place. Do not duplicate the same assertion
    across suites.
- Database security and logic belong to pgTAP
  - pgTAP is the sole source of truth for ALL RLS, policies, triggers, constraints, and SQL
    functions (RPCs).
  - supabase-js MUST NOT be used to validate RLS or policy behavior. Doing so duplicates coverage
    and creates flakiness.
- Application and UI behavior belong to app tests
  - supabase-js tests focus on application flows, UI state, and integration wiring (e.g., correct
    queries are called, errors are surfaced to users).
  - App tests should not reassert invariants already guaranteed by pgTAP.
- Only test stable contracts
  - Avoid tests that lock in non-contractual details (e.g., exact CSS colors, pixel values). Prefer
    testing semantics and public contracts.
- Reference
  - See `@supabase.mdc` for detailed guidance and examples on structuring pgTAP vs app tests.

### Required changes (enforce the principles)

- Database coverage moved to pgTAP (policies/RPCs)
  - Problem: All RLS and function assertions are currently via `supabase-js`. There are zero `pgTAP`
    unit tests in `supabase/tests/**`.
  - Required changes:
    - Add pgTAP suites:
      - `supabase/tests/policies/**` for RLS and policies
      - `supabase/tests/functions/**` for SQL functions
    - Cover positive/negative RLS via `SET LOCAL request.jwt.claims` and `lives_ok()/throws_ok()`.
    - Add function tests for `get_user_file_path` and `validate_user_file_path`.
    - Remove or refactor any app tests that assert RLS/policy behavior. If a user-facing flow
      depends on RLS, app tests may only verify the user-visible outcome (e.g., error message
      shown), not the enforcement itself.
    - Example skeleton:
      ```sql
      -- supabase/tests/policies/profiles_rls_test.sql
      BEGIN;
      SELECT plan(2);
      SELECT set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001"}', true);
      SET LOCAL ROLE authenticated;
      SELECT lives_ok($$ INSERT INTO public.profiles (id,email) VALUES ('00000000-0000-0000-0000-000000000001','a@b.com') $$);
      SELECT throws_ok($$ INSERT INTO public.profiles (id,email) VALUES ('00000000-0000-0000-0000-000000000002','x@y.com') $$);
      SELECT * FROM finish();
      ROLLBACK;
      ```

- Hardcoded identifiers/emails (guidelines: “Do not hardcode static data; always generate
  dynamically”)
  - Problem: Multiple tests use static emails like `subscription-test@example.com`,
    `test-user-1@example.com`, etc. This risks collisions across runs/parallelism and can cause
    pollution if teardown fails.
  - Fix:
    - Use unique values: `const email = \`test-${Date.now()}-${crypto.randomUUID()}@example.com\``.
    - Apply across `schema.test.ts`, `rls.test.ts`, `storage/bucket-operations.test.ts`, and
      `integration/database-operations.test.ts`.

- Remove platform testing anti-patterns
  - Problem: `bucket-operations.test.ts` uploads large buffers (>50MB) to test Supabase storage
    platform limits. This tests third-party behavior we don't control and is memory-heavy in CI.
  - Fix:
    - **Remove all tests that validate Supabase platform limits** (file size limits, bucket quotas,
      storage enforcement).
    - Trust Supabase to enforce their own platform limits correctly.
    - Focus storage tests only on application-specific logic (user file path validation,
      authorization, etc.).

- Test isolation and cleanup
  - Mostly good, but tighten:
    - Ensure every test that inserts rows deletes by IDs captured during test.
    - In `storage/bucket-operations.test.ts`, the initial folder removal
      `remove([`${userId}/test/`])` may not delete anything. Prefer listing then removing by exact
      paths or ensure tests always upload to randomized prefixes.

- Remove RLS assertions from app tests
  - Problem: App tests currently try to validate RLS with patterns like
    `expect(error || data.length === 0).toBeTruthy()` which are brittle and duplicate db guarantees.
  - Required changes:
    - Delete or refactor such tests to focus on user-visible outcomes only (e.g., display of
      authorization errors, disabled actions).
    - All RLS/permission enforcement must be asserted in pgTAP.

- Triggers timestamp flakiness
  - Current wait is 100ms; time resolution or clock skew could cause false negatives.
  - Fix:
    - Increase wait to ~300–500ms, or update a second time to ensure delta, or assert `updated_at`
      changes with a different column change and verify inequality rather than greater-than if
      clocks can be equal.

- Clear separation of admin versus user operations (key management)
  - Good in code, but enforce in tests:
    - Ensure no test calls user flows via `createServiceRoleClient` except setup/teardown.
    - Keep `SUPABASE_SERVICE_ROLE_KEY` usage confined to server-side helper only (current code does
      this).

### What NOT to test (non-contractual details)

- Avoid hard-coding or asserting exact CSS colors, spacing, or pixel values.
- Avoid asserting implementation details that can change without breaking the public contract (e.g.,
  internal constants, private function calls).
- Prefer accessibility and semantic assertions (e.g., role, name, state) and user-visible outcomes
  over styles.

### Optional improvements

- Add a small "smoke" pgTAP test suite to validate migrations (tables exist, enums, indexes)
  quickly.
- Add test helpers to create/cleanup users and records with randomized prefixes to DRY setup code.

- **SEO metadata tests**: `apps/web/tests/seo/metadata.test.ts`
  - Issue: Never calls real code. Builds a local `expectedMetadata` object and asserts its own
    constants; always passes.
  - Fix: Import and call real generators.
    - For blog posts: import `generateMetadata` from `app/blog/[slug]/page.tsx` and call with
      `{ params: Promise.resolve({ slug }) }`, mocking `getPostBySlug`.
    - For blog index: import `metadata` from `app/blog/page.tsx`.
  - Example:
    ```ts
    import { generateMetadata } from '@/app/blog/[slug]/page'
    import { vi } from 'vitest'
    vi.mock('@/lib/content-utils', () => ({
      getPostBySlug: vi.fn(() => ({
        title: 'T',
        description: 'D',
        date: '2024-01-01',
        url: '/blog/t',
        tags: ['seo'],
        body: { code: '', raw: '' },
      })),
    }))
    it('generates post metadata', async () => {
      const md = await generateMetadata({
        params: Promise.resolve({ slug: 't' }),
      })
      expect(md.openGraph?.type).toBe('article')
      expect(md.openGraph?.images?.[0]?.url).toContain('/api/og?title=')
    })
    ```

- **Open Graph tests**: `apps/web/tests/seo/open-graph.test.ts`
  - Issue: Asserts constants about widths/colors; never calls the `GET` route in
    `app/api/og/route.tsx`.
  - Fix: Import and execute the route handler with a real Request/NextRequest URL.
  - Example:
    ```ts
    import { GET } from '@/app/api/og/route'
    import { NextRequest } from 'next/server'
    it('handles title and theme', async () => {
      const req = new NextRequest('http://test/api/og?title=Hello&type=blog&theme=dark')
      const res = await GET(req)
      expect(res.status).toBe(200)
      expect(res.headers.get('Cache-Control')).toContain('immutable')
    })
    ```

- **Sitemap tests**: `apps/web/tests/seo/sitemap.test.ts`
  - Issue: Tests string arrays and hard-coded patterns; never exercises actual configuration or
    outputs.
  - Fix options:
    - Import and validate `apps/web/next-sitemap.config.js` content directly.
    - Or read `apps/web/public/sitemap.xml` and assert it includes known static pages and post slugs
      from contentlayer.
    - Also import `app/robots.txt/route.ts` and assert handler output.
  - Example (robots route):
    ```ts
    import { GET } from '@/app/robots.txt/route'
    it('returns robots content', async () => {
      const res = await GET()
      const txt = await res.text()
      expect(txt).toContain('Sitemap:')
    })
    ```

- **Content utilities tests**: `apps/web/tests/lib/content-utils.test.ts`
  - Issue: Re-implements mini versions of utilities inline instead of importing
    `@/lib/content-utils`. This tests the test, not production code.
  - Fix: Import and test the real functions; cover sentence-boundary excerpt logic and invalid-date
    handling.
  - Example:
    ```ts
    import {
      calculateReadingTime,
      filterPostsByTag,
      generateExcerpt,
      sortPostsByDate,
    } from '@/lib/content-utils'
    it('excerpt prefers sentence boundary', () => {
      const text = 'A sentence. Another one that is long enough to cut. Final.'
      expect(generateExcerpt(text, 30)).toMatch(/\.$|\.{3}$/)
    })
    it('sort handles invalid dates', () => {
      const sorted = sortPostsByDate([
        { title: 'a', date: 'x' },
        {
          title: 'b',
          date: '2024-01-01',
        },
      ])
      expect(sorted[0].title).toBe('b')
    })
    ```

- **Contentlayer tests**: `apps/web/tests/content/*.test.ts`
  - Issues:
    - `contentlayer.test.ts` and `mdx-processing.test.ts` rely on conditionals that skip assertions
      when content doesn’t contain markers (e.g., if no posts or no features present, tests
      vacuously pass).
    - They also rely on `.contentlayer/generated` being present. If not generated, imports will
      fail; if empty, tests mostly pass due to guards.
  - Fix:
    - Ensure contentlayer runs in test setup (pre-generate during CI) or stub `allPosts` with
      representative fixtures that include GFM features, code fences, headings, etc.
    - Replace conditional checks with fixture-driven assertions.
  - Example:
    ````ts
    vi.mock('../../.contentlayer/generated', () => ({
      allPosts: [
        {
          title: 'GFM',
          slug: 'gfm',
          date: '2024-01-01',
          body: {
            raw: '~~strike~~\n\n|a|b|\n- [x] done\n```ts\nconst x=1\n```',
            code: '<del/>...<table/>...hljs language-typescript',
          },
        },
      ],
    }))
    it('compiles GFM, tables, tasks, code', () => {
      const post = allPosts[0]
      expect(post.body.code).toMatch(/del/)
      expect(post.body.code).toMatch(/table/)
      expect(post.body.code).toMatch(/hljs/)
    })
    ````

- **Type generation tests**: `apps/web/tests/types/generation.test.ts`
  - Issues:
    - Runtime checks on TypeScript types are weak; `@ts-expect-error` comments are not enforced by
      Vitest transpilation.
  - Fix:
    - Use `expectTypeOf` from Vitest for type-level assertions, or add a separate `tsd` test suite.
    - Focus runtime tests on constructing real objects from DB responses to ensure shape
      consistency, which you already do elsewhere.
  - Example:
    ```ts
    import { expectTypeOf } from 'vitest'
    type ProfileRow = Database['public']['Tables']['profiles']['Row']
    expectTypeOf<ProfileRow>().toMatchTypeOf<{ id: string; email: string }>()
    ```

### References

- `@supabase.mdc` for database testing guidance
- Supabase CLI: `supabase test db`, `supabase start`, `supabase db reset`
