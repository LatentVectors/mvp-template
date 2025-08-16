-- =====================================================
-- Development Seed Data
-- =====================================================
-- This file contains seed data for local development and testing.
-- It includes sample users, subscriptions, and usage counters.
-- All insertions are idempotent to prevent duplicate data on re-runs.

-- =====================================================
-- Helper Functions for Idempotent Operations
-- =====================================================

-- =====================================================
-- Sample Test Users
-- =====================================================

-- Create test users with predictable UUIDs for consistent testing
-- NOTE: This is ONLY for local development seeding!
-- In production, users are created through Supabase Auth API

-- Create auth.users records first
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES 
    (
        '11111111-1111-1111-1111-111111111111'::UUID,
        '00000000-0000-0000-0000-000000000000'::UUID,
        'authenticated',
        'authenticated',
        'alice@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NULL,
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ),
    (
        '22222222-2222-2222-2222-222222222222'::UUID,
        '00000000-0000-0000-0000-000000000000'::UUID,
        'authenticated',
        'authenticated',
        'bob@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NULL,
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ),
    (
        '33333333-3333-3333-3333-333333333333'::UUID,
        '00000000-0000-0000-0000-000000000000'::UUID,
        'authenticated',
        'authenticated',
        'charlie@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NULL,
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ),
    (
        '44444444-4444-4444-4444-444444444444'::UUID,
        '00000000-0000-0000-0000-000000000000'::UUID,
        'authenticated',
        'authenticated',
        'diana@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NULL,
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    )
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- Create corresponding profile records
INSERT INTO public.profiles (id, email, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111'::UUID, 'alice@example.com', NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222'::UUID, 'bob@example.com', NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333333'::UUID, 'charlie@example.com', NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444444'::UUID, 'diana@example.com', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- =====================================================
-- Sample Subscriptions
-- =====================================================

-- Alice: Active Pro user with current subscription
INSERT INTO public.subscriptions (
    id,
    user_id,
    status,
    plan,
    lemon_squeezy_id,
    current_period_start,
    current_period_end,
    trial_ends_at,
    created_at,
    updated_at
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID,
    '11111111-1111-1111-1111-111111111111'::UUID,
    'active',
    'pro',
    'ls_12345',
    NOW() - INTERVAL '15 days',
    NOW() + INTERVAL '15 days',
    NULL,
    NOW() - INTERVAL '30 days',
    NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    status = EXCLUDED.status,
    plan = EXCLUDED.plan,
    lemon_squeezy_id = EXCLUDED.lemon_squeezy_id,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = NOW();

-- Bob: Trial user (basic plan, trial active)
INSERT INTO public.subscriptions (
    id,
    user_id,
    status,
    plan,
    lemon_squeezy_id,
    current_period_start,
    current_period_end,
    trial_ends_at,
    created_at,
    updated_at
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::UUID,
    '22222222-2222-2222-2222-222222222222'::UUID,
    'trial',
    'basic',
    NULL,
    NOW() - INTERVAL '7 days',
    NOW() + INTERVAL '23 days',
    NOW() + INTERVAL '7 days',
    NOW() - INTERVAL '7 days',
    NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    status = EXCLUDED.status,
    plan = EXCLUDED.plan,
    trial_ends_at = EXCLUDED.trial_ends_at,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = NOW();

-- Charlie: Free plan user
INSERT INTO public.subscriptions (
    id,
    user_id,
    status,
    plan,
    lemon_squeezy_id,
    current_period_start,
    current_period_end,
    trial_ends_at,
    created_at,
    updated_at
) VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::UUID,
    '33333333-3333-3333-3333-333333333333'::UUID,
    'active',
    'free',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '60 days',
    NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    status = EXCLUDED.status,
    plan = EXCLUDED.plan,
    updated_at = NOW();

-- Diana: Cancelled subscription (was on basic)
INSERT INTO public.subscriptions (
    id,
    user_id,
    status,
    plan,
    lemon_squeezy_id,
    current_period_start,
    current_period_end,
    trial_ends_at,
    created_at,
    updated_at
) VALUES (
    'dddddddd-dddd-dddd-dddd-dddddddddddd'::UUID,
    '44444444-4444-4444-4444-444444444444'::UUID,
    'cancelled',
    'basic',
    'ls_67890',
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '15 days',
    NULL,
    NOW() - INTERVAL '90 days',
    NOW() - INTERVAL '15 days'
)
ON CONFLICT (user_id) DO UPDATE SET
    status = EXCLUDED.status,
    plan = EXCLUDED.plan,
    lemon_squeezy_id = EXCLUDED.lemon_squeezy_id,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = EXCLUDED.updated_at;

-- =====================================================
-- Sample Usage Counters
-- =====================================================

-- Current month usage counters - insert directly with variables
WITH date_ranges AS (
    SELECT 
        date_trunc('month', NOW()) as current_month_start,
        date_trunc('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 second' as current_month_end
)
INSERT INTO public.usage_counters (user_id, metric, count, window_start, window_end, created_at, updated_at)
SELECT * FROM (
    SELECT '11111111-1111-1111-1111-111111111111'::UUID, 'api_calls', 8750, current_month_start, current_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '11111111-1111-1111-1111-111111111111'::UUID, 'storage_mb', 1024, current_month_start, current_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '11111111-1111-1111-1111-111111111111'::UUID, 'agent_runs', 145, current_month_start, current_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '22222222-2222-2222-2222-222222222222'::UUID, 'api_calls', 2340, current_month_start, current_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '22222222-2222-2222-2222-222222222222'::UUID, 'storage_mb', 256, current_month_start, current_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '22222222-2222-2222-2222-222222222222'::UUID, 'agent_runs', 23, current_month_start, current_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '33333333-3333-3333-3333-333333333333'::UUID, 'api_calls', 890, current_month_start, current_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '33333333-3333-3333-3333-333333333333'::UUID, 'storage_mb', 45, current_month_start, current_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '33333333-3333-3333-3333-333333333333'::UUID, 'agent_runs', 8, current_month_start, current_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '44444444-4444-4444-4444-444444444444'::UUID, 'api_calls', 0, current_month_start, current_month_end, NOW(), NOW() FROM date_ranges
) AS usage_data
ON CONFLICT (user_id, metric, window_start) DO UPDATE SET
    count = EXCLUDED.count,
    window_end = EXCLUDED.window_end,
    updated_at = NOW();

-- Previous month usage counters for historical data
WITH date_ranges AS (
    SELECT 
        date_trunc('month', NOW() - INTERVAL '1 month') as prev_month_start,
        date_trunc('month', NOW()) - INTERVAL '1 second' as prev_month_end
)
INSERT INTO public.usage_counters (user_id, metric, count, window_start, window_end, created_at, updated_at)
SELECT * FROM (
    SELECT '11111111-1111-1111-1111-111111111111'::UUID, 'api_calls', 9890, prev_month_start, prev_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '11111111-1111-1111-1111-111111111111'::UUID, 'storage_mb', 892, prev_month_start, prev_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '11111111-1111-1111-1111-111111111111'::UUID, 'agent_runs', 156, prev_month_start, prev_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '22222222-2222-2222-2222-222222222222'::UUID, 'api_calls', 450, prev_month_start, prev_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '33333333-3333-3333-3333-333333333333'::UUID, 'api_calls', 1250, prev_month_start, prev_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '33333333-3333-3333-3333-333333333333'::UUID, 'storage_mb', 67, prev_month_start, prev_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '44444444-4444-4444-4444-444444444444'::UUID, 'api_calls', 3400, prev_month_start, prev_month_end, NOW(), NOW() FROM date_ranges
    UNION ALL
    SELECT '44444444-4444-4444-4444-444444444444'::UUID, 'storage_mb', 234, prev_month_start, prev_month_end, NOW(), NOW() FROM date_ranges
) AS usage_data
ON CONFLICT (user_id, metric, window_start) DO UPDATE SET
    count = EXCLUDED.count,
    window_end = EXCLUDED.window_end,
    updated_at = NOW();

-- =====================================================
-- Cleanup Helper Functions
-- =====================================================

-- No cleanup needed - using direct SQL statements

-- =====================================================
-- Seed Data Summary
-- =====================================================

-- Display summary of seeded data
DO $$
BEGIN
    RAISE NOTICE '======================================';
    RAISE NOTICE 'Seed Data Applied Successfully';
    RAISE NOTICE '======================================';
    RAISE NOTICE 'Users created: 4';
    RAISE NOTICE 'Subscriptions created: 4';
    RAISE NOTICE 'Usage counters created: ~20';
    RAISE NOTICE '';
    RAISE NOTICE 'Test Users:';
    RAISE NOTICE '- alice@example.com (Pro, Active)';
    RAISE NOTICE '- bob@example.com (Basic, Trial)';
    RAISE NOTICE '- charlie@example.com (Free, Active)';
    RAISE NOTICE '- diana@example.com (Basic, Cancelled)';
    RAISE NOTICE '======================================';
END $$;
