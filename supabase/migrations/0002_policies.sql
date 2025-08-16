-- =====================================================
-- Enable Row Level Security
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Profiles Table Policies
-- =====================================================

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Service role can manage all profiles (for webhooks, admin operations)
DROP POLICY IF EXISTS "Service role can manage profiles" ON public.profiles;
CREATE POLICY "Service role can manage profiles" ON public.profiles
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- =====================================================
-- Subscriptions Table Policies
-- =====================================================

-- Users can read their own subscription
DROP POLICY IF EXISTS "Users can read own subscription" ON public.subscriptions;
CREATE POLICY "Users can read own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Only service role can modify subscriptions (webhook-driven updates)
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- =====================================================
-- Usage Counters Table Policies
-- =====================================================

-- Users can read their own usage data
DROP POLICY IF EXISTS "Users can read own usage" ON public.usage_counters;
CREATE POLICY "Users can read own usage" ON public.usage_counters
    FOR SELECT USING (auth.uid() = user_id);

-- Only service role can modify usage counters (API usage tracking)
DROP POLICY IF EXISTS "Service role can manage usage" ON public.usage_counters;
CREATE POLICY "Service role can manage usage" ON public.usage_counters
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
