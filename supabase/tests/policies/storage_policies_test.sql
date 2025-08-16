-- pgTAP tests for storage bucket configuration and path validation helpers

CREATE EXTENSION IF NOT EXISTS pgtap;

BEGIN;

SET LOCAL search_path = extensions, public, storage, pg_temp;

SELECT plan(5);

-- Bucket exists and is private
SELECT is(
  (SELECT count(*) FROM storage.buckets WHERE id = 'user-files' AND public = false),
  1::bigint,
  'user-files bucket exists and is private'
);

-- Path helper functions
-- u1: 00000000-0000-0000-0000-000000000001
SELECT is(
  public.get_user_file_path('00000000-0000-0000-0000-000000000001', 'file.txt', 'images'),
  '00000000-0000-0000-0000-000000000001/images/file.txt',
  'get_user_file_path returns expected format'
);

SELECT is(
  public.validate_user_file_path('00000000-0000-0000-0000-000000000001/images/file.txt', '00000000-0000-0000-0000-000000000001'),
  true,
  'validate_user_file_path allows own prefix'
);

SELECT is(
  public.validate_user_file_path('00000000-0000-0000-0000-000000000002/images/file.txt', '00000000-0000-0000-0000-000000000001'),
  false,
  'validate_user_file_path rejects other user prefix'
);

-- Optional: ensure leading user id is required
SELECT is(
  public.validate_user_file_path('images/file.txt', '00000000-0000-0000-0000-000000000001'),
  false,
  'validate_user_file_path rejects paths without user prefix'
);

SELECT * FROM finish();
ROLLBACK;


