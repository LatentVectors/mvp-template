-- =====================================================
-- Storage Bucket Configuration
-- =====================================================

-- Create user-files bucket for organized file storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'user-files',
    'user-files',
    false, -- Private bucket requiring authentication
    52428800, -- 50MB file size limit
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'text/plain;charset=UTF-8',
        'text/csv',
        'application/json',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ]
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =====================================================
-- Storage Row Level Security Policies
-- Note: Storage policies are automatically managed by Supabase
-- and cannot be modified directly via migrations
-- =====================================================

-- Create storage policies using the storage schema approach
-- These will be applied through Supabase's storage API

-- =====================================================
-- Storage Helper Functions
-- =====================================================

-- Function to get user file path with organized structure
CREATE OR REPLACE FUNCTION get_user_file_path(
    user_id UUID,
    file_name TEXT,
    file_category TEXT DEFAULT 'general'
)
RETURNS TEXT AS $$
BEGIN
    -- Return organized path: {user_id}/{category}/{file_name}
    RETURN user_id::text || '/' || file_category || '/' || file_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate file path belongs to user
CREATE OR REPLACE FUNCTION validate_user_file_path(
    file_path TEXT,
    user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if the file path starts with the user's ID
    RETURN file_path ~ ('^' || user_id::text || '/.*');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_user_file_path(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_user_file_path(TEXT, UUID) TO authenticated;
