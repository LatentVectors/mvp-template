
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

-- Seed subscriptions as service role
INSERT INTO public.subscriptions (user_id, status, plan)
VALUES ('00000000-0000-0000-0000-000000000001', 'active', 'free')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.subscriptions (user_id, status, plan)
VALUES ('00000000-0000-0000-0000-000000000002', 'trial', 'pro')
ON CONFLICT (user_id) DO NOTHING;

-- As user1: can read own subscription, cannot read others
SELECT set_config(
  'request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', true
);
SET LOCAL ROLE authenticated;

SELECT is(
  (SELECT count(*) FROM public.subscriptions WHERE user_id = '00000000-0000-0000-0000-000000000001'),
  1::bigint,
  'user can read own subscription'
);

SELECT is(
  (SELECT count(*) FROM public.subscriptions WHERE user_id = '00000000-0000-0000-0000-000000000002'),
  0::bigint,
  'user cannot read other subscriptions'
);

-- As user1: cannot modify own subscription (write restricted to service_role)
SELECT lives_ok(
  $$ UPDATE public.subscriptions SET plan = 'pro' WHERE user_id = '00000000-0000-0000-0000-000000000001' $$,
  'update attempt is filtered by RLS'
);

-- As user1: cannot insert a subscription row
SELECT set_config(
  'request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', true
);
SET LOCAL ROLE authenticated;
SELECT throws_ok(
  $$ INSERT INTO public.subscriptions (user_id, status, plan)
     VALUES ('00000000-0000-0000-0000-000000000001', 'active', 'basic') $$,
  '42501',
  'new row violates row-level security policy for table "subscriptions"'
);

-- Verify unchanged as service role
SELECT set_config(
  'request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"service_role"}', true
);
SET LOCAL ROLE authenticated;
SELECT is(
  (SELECT plan FROM public.subscriptions WHERE user_id = '00000000-0000-0000-0000-000000000001'),
  'free',
  'user update did not change subscription'
);

-- Service role can manage subscriptions
SELECT lives_ok(
  $$ UPDATE public.subscriptions SET plan = 'basic' WHERE user_id = '00000000-0000-0000-0000-000000000002' $$,
  'service role can update any subscription'
);
SELECT is(
  (SELECT plan FROM public.subscriptions WHERE user_id = '00000000-0000-0000-0000-000000000002'),
  'basic',
  'service role update took effect'
);

SELECT * FROM finish();
ROLLBACK;


