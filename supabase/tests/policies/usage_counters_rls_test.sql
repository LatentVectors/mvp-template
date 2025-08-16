
BEGIN;

SET LOCAL search_path = extensions, public, pg_temp;

SELECT plan(7);

-- Deterministic user IDs
-- u1: 00000000-0000-0000-0000-000000000001
-- u2: 00000000-0000-0000-0000-000000000002

-- Drop FK to auth.users to allow seeding profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Seed profiles as service role
SELECT set_config(
  'request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"service_role"}', true
);
SET LOCAL ROLE authenticated;
INSERT INTO public.profiles (id, email) VALUES ('00000000-0000-0000-0000-000000000001', 'u1@example.com')
ON CONFLICT (id) DO NOTHING;

SELECT set_config(
  'request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002","role":"service_role"}', true
);
SET LOCAL ROLE authenticated;
INSERT INTO public.profiles (id, email) VALUES ('00000000-0000-0000-0000-000000000002', 'u2@example.com')
ON CONFLICT (id) DO NOTHING;

-- Seed usage counters as service role
INSERT INTO public.usage_counters (user_id, metric, count, window_start, window_end)
VALUES ('00000000-0000-0000-0000-000000000001', 'api_calls', 10, NOW(), NOW() + interval '30 days')
ON CONFLICT DO NOTHING;

INSERT INTO public.usage_counters (user_id, metric, count, window_start, window_end)
VALUES ('00000000-0000-0000-0000-000000000002', 'api_calls', 5, NOW(), NOW() + interval '30 days')
ON CONFLICT DO NOTHING;

-- As user1: can read own usage, cannot read others
SELECT set_config(
  'request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', true
);
SET LOCAL ROLE authenticated;

SELECT is(
  (SELECT count(*) FROM public.usage_counters WHERE user_id = '00000000-0000-0000-0000-000000000001'),
  1::bigint,
  'user can read own usage row'
);

SELECT is(
  (SELECT count(*) FROM public.usage_counters WHERE user_id = '00000000-0000-0000-0000-000000000002'),
  0::bigint,
  'user cannot read other usage rows'
);

-- As user1: cannot modify usage counters
SELECT lives_ok(
  $$ UPDATE public.usage_counters SET count = count + 1 WHERE user_id = '00000000-0000-0000-0000-000000000001' $$,
  'update attempt is filtered by RLS'
);

-- As user1: cannot insert a usage counter row (no insert policy)
SELECT throws_ok(
  $$ INSERT INTO public.usage_counters (user_id, metric, count, window_start, window_end)
     VALUES ('00000000-0000-0000-0000-000000000001', 'api_calls', 999, NOW(), NOW() + interval '1 day') $$,
  '42501',
  'new row violates row-level security policy for table "usage_counters"'
);

-- Verify unchanged as service role
SELECT set_config(
  'request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"service_role"}', true
);
SET LOCAL ROLE authenticated;
SELECT is(
  (SELECT count FROM public.usage_counters WHERE user_id = '00000000-0000-0000-0000-000000000001'),
  10::integer,
  'user update did not change usage count'
);

-- Service role can modify usage counters
SELECT lives_ok(
  $$ UPDATE public.usage_counters SET count = count + 2 WHERE user_id = '00000000-0000-0000-0000-000000000002' $$,
  'service role can update usage counters'
);
SELECT is(
  (SELECT count FROM public.usage_counters WHERE user_id = '00000000-0000-0000-0000-000000000002'),
  7::integer,
  'service role update took effect'
);

SELECT * FROM finish();
ROLLBACK;


