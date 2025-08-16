BEGIN;

SET LOCAL search_path = extensions, public, pg_temp;

SELECT plan(6);

-- Test data
-- Two deterministic UUIDs for repeatability in tests
-- user 1
-- 00000000-0000-0000-0000-000000000001
-- user 2
-- 00000000-0000-0000-0000-000000000002

-- Seed rows as service role (bypass RLS via policy)
-- Drop FK temporarily to avoid needing real rows in auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000001","role":"service_role"}',
  true
);
SET LOCAL ROLE authenticated;

INSERT INTO public.profiles (id, email) VALUES ('00000000-0000-0000-0000-000000000001', 'u1@example.com')
ON CONFLICT (id) DO NOTHING;

SELECT set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000002","role":"service_role"}',
  true
);
SET LOCAL ROLE authenticated;

INSERT INTO public.profiles (id, email) VALUES ('00000000-0000-0000-0000-000000000002', 'u2@example.com')
ON CONFLICT (id) DO NOTHING;

-- As user1 (authenticated), can read and update own row
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);
SET LOCAL ROLE authenticated;

-- Read own profile returns exactly one row
SELECT is(
  (SELECT count(*) FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001'),
  1::bigint,
  'user can read own profile'
);

-- Cannot read another user (RLS filters it out)
SELECT is(
  (SELECT count(*) FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000002'),
  0::bigint,
  'user cannot read other profiles'
);

-- Can update own profile
SELECT lives_ok(
  $$ UPDATE public.profiles SET email = 'u1+updated@example.com' WHERE id = '00000000-0000-0000-0000-000000000001' $$,
  'user can update own profile'
);

-- Attempting to update other user's profile should have no effect (RLS filters row)
SELECT lives_ok(
  $$ UPDATE public.profiles SET email = 'hax@example.com' WHERE id = '00000000-0000-0000-0000-000000000002' $$,
  'update on other profile is filtered, not permitted'
);
-- Verify unchanged as service role (bypass RLS for verification only)
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000001","role":"service_role"}',
  true
);
SET LOCAL ROLE authenticated;
SELECT is(
  (SELECT email FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000002'),
  'u2@example.com',
  'other user profile remains unchanged'
);

-- Service role can manage any profile
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-000000000001","role":"service_role"}',
  true
);
SET LOCAL ROLE authenticated;

SELECT lives_ok(
  $$ UPDATE public.profiles SET email = 'service+updated@example.com' WHERE id = '00000000-0000-0000-0000-000000000002' $$,
  'service role can manage profiles'
);

SELECT * FROM finish();
ROLLBACK;


