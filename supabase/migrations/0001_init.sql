-- =====================================================
-- Core Application Tables
-- =====================================================

-- Profiles table - extends Supabase auth.users with application data
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Subscriptions table - billing and plan management
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('trial', 'active', 'cancelled', 'expired', 'past_due')),
    plan TEXT NOT NULL CHECK (plan IN ('free', 'basic', 'pro')),
    lemon_squeezy_id TEXT, -- External payment provider ID
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id) -- One subscription per user
);

-- Usage counters table - quota tracking and billing metrics
CREATE TABLE IF NOT EXISTS public.usage_counters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    metric TEXT NOT NULL, -- 'api_calls', 'storage_mb', 'agent_runs', etc.
    count INTEGER NOT NULL DEFAULT 0,
    window_start TIMESTAMPTZ NOT NULL, -- Start of billing/usage window
    window_end TIMESTAMPTZ NOT NULL,   -- End of billing/usage window
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, metric, window_start)
);

-- =====================================================
-- Performance Indexes
-- =====================================================

-- Primary lookup indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON public.subscriptions(plan);

-- Usage tracking indexes
CREATE INDEX IF NOT EXISTS idx_usage_counters_user_metric ON public.usage_counters(user_id, metric);
CREATE INDEX IF NOT EXISTS idx_usage_counters_window ON public.usage_counters(window_start, window_end);
CREATE INDEX IF NOT EXISTS idx_usage_counters_metric ON public.usage_counters(metric);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_usage_counters_user_window ON public.usage_counters(user_id, window_start, window_end);

-- =====================================================
-- Updated At Triggers
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_counters_updated_at
    BEFORE UPDATE ON public.usage_counters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
