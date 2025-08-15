# Database Schema

This is the database schema implementation for the spec detailed in
@**specs**/2025-08-15-database-foundation-type-generation/spec.md

## Migration Files Structure

### 0001_init.sql - Core Tables

```sql
-- =====================================================
-- Core Application Tables
-- =====================================================

-- Users table - extends Supabase auth.users with application data
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Subscriptions table - billing and plan management
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_counters_updated_at
    BEFORE UPDATE ON public.usage_counters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 0002_policies.sql - Row Level Security

```sql
-- =====================================================
-- Enable Row Level Security
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Users Table Policies
-- =====================================================

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Service role can manage all users (for webhooks, admin operations)
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;
CREATE POLICY "Service role can manage users" ON public.users
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
```

### 0003_storage.sql - Storage Bucket Setup

```sql
-- =====================================================
-- Storage Bucket Configuration
-- =====================================================

-- Create user files bucket (private by default)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'user-files',
    'user-files',
    false,
    52428800, -- 50MB limit per file
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'text/csv']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Storage Security Policies
-- =====================================================

-- Users can upload files to their own folder
DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
CREATE POLICY "Users can upload own files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'user-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can read files from their own folder
DROP POLICY IF EXISTS "Users can read own files" ON storage.objects;
CREATE POLICY "Users can read own files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'user-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can update files in their own folder
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'user-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can delete files from their own folder
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'user-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Service role can manage all files (for admin operations, cleanup)
DROP POLICY IF EXISTS "Service role can manage all files" ON storage.objects;
CREATE POLICY "Service role can manage all files" ON storage.objects
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
```

## Schema Design Rationale

### User Management

- **Extension Pattern**: `public.users` extends `auth.users` rather than replacing it
- **Data Sync**: Email stored in both tables for application convenience
- **Cascade Deletes**: User deletion removes all associated data automatically

### Subscription Management

- **Single Subscription**: UNIQUE constraint ensures one subscription per user
- **Status Tracking**: Comprehensive status enum covers all billing states
- **External Integration**: `lemon_squeezy_id` field for payment provider linkage
- **Time Windows**: Period tracking for billing cycles and trial management

### Usage Tracking

- **Flexible Metrics**: Generic metric system supports any trackable resource
- **Time Windows**: Window-based tracking enables monthly/daily quotas
- **Composite Keys**: Prevents duplicate entries per user/metric/window
- **Efficient Queries**: Indexes optimized for quota checking and reporting

### Storage Organization

- **Path Convention**: `{userId}/{entity}/{yyyy}/{mm}/{uuid}.ext}` format
- **User Isolation**: RLS policies enforce strict user-based access control
- **File Limits**: Size and MIME type restrictions prevent abuse
- **Cleanup Ready**: Service role access enables automated file management

### Performance Considerations

- **Strategic Indexing**: Indexes on foreign keys and frequently queried columns
- **RLS Optimization**: Policies use indexed columns (user_id, auth.uid())
- **Query Patterns**: Indexes designed for expected application access patterns
- **Scalability**: Schema design supports growth without structural changes

### Security Model

- **Defense in Depth**: RLS policies + application-level checks + API validation
- **Principle of Least Privilege**: Users can only access their own data
- **Service Role Segregation**: Administrative operations clearly separated
- **Audit Trail**: Timestamps and user IDs enable activity tracking
