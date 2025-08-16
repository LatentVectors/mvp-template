
BEGIN;

SET LOCAL search_path = extensions, public, pg_temp;

SELECT plan(5);

-- Drop FK to auth.users to allow seeding profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Seed a profile to reference in child tables
INSERT INTO public.profiles (id, email)
VALUES ('00000000-0000-0000-0000-000000000010', 'trigger@test.com')
ON CONFLICT (id) DO NOTHING;

-- Insert into subscriptions and usage_counters
INSERT INTO public.subscriptions (user_id, status, plan)
VALUES ('00000000-0000-0000-0000-000000000010', 'active', 'free')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.usage_counters (user_id, metric, count, window_start, window_end)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  'api_calls',
  0,
  NOW(),
  NOW() + interval '1 day'
) ON CONFLICT DO NOTHING;

-- Capture initial timestamps
SELECT ok((SELECT created_at <= updated_at FROM public.subscriptions WHERE user_id = '00000000-0000-0000-0000-000000000010'), 'initial timestamps set');

-- Sleep ~400ms to ensure measurable delta
DO $$ BEGIN PERFORM pg_sleep(0.4); END $$;

-- Update a non-timestamp column and ensure updated_at changes (inequality)
-- Use service role to bypass RLS for updates in tests
SELECT set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000010","role":"service_role"}', true);
SET LOCAL ROLE authenticated;
UPDATE public.subscriptions SET plan = 'basic' WHERE user_id = '00000000-0000-0000-0000-000000000010';
SELECT ok(
  (SELECT updated_at > created_at FROM public.subscriptions WHERE user_id = '00000000-0000-0000-0000-000000000010'),
  'subscriptions.updated_at advanced after update'
);

-- Repeat for usage_counters: update count and verify updated_at changed
DO $$ BEGIN PERFORM pg_sleep(0.35); END $$;
UPDATE public.usage_counters SET count = count + 1 WHERE user_id = '00000000-0000-0000-0000-000000000010';
SELECT ok(
  (SELECT updated_at > created_at FROM public.usage_counters WHERE user_id = '00000000-0000-0000-0000-000000000010'),
  'usage_counters.updated_at advanced after update'
);

-- Profiles: update email to trigger updated_at
DO $$ BEGIN PERFORM pg_sleep(0.35); END $$;
UPDATE public.profiles SET email = 'trigger+2@test.com' WHERE id = '00000000-0000-0000-0000-000000000010';
SELECT ok(
  (SELECT updated_at > created_at FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000010'),
  'profiles.updated_at advanced after update'
);

-- Verify updated_at changes again on subsequent update
WITH prev AS (
  SELECT updated_at AS prev_updated_at FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000010'
), upd AS (
  UPDATE public.profiles SET email = 'trigger+3@test.com' WHERE id = '00000000-0000-0000-0000-000000000010' RETURNING updated_at
)
SELECT ok(
  (SELECT prev_updated_at FROM prev) < (SELECT updated_at FROM upd),
  'profiles.updated_at changes across updates'
);

SELECT * FROM finish();
ROLLBACK;


