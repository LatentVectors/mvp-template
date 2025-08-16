
BEGIN;

SET LOCAL search_path = extensions, public, pg_temp;

SELECT plan(9);

-- Deterministic user ID
-- u1: 00000000-0000-0000-0000-000000000001

-- get_user_file_path: explicit category
SELECT is(
  public.get_user_file_path('00000000-0000-0000-0000-000000000001', 'file.txt', 'images'),
  '00000000-0000-0000-0000-000000000001/images/file.txt',
  'explicit category path'
);

-- get_user_file_path: default category
SELECT is(
  public.get_user_file_path('00000000-0000-0000-0000-000000000001', 'readme.md'),
  '00000000-0000-0000-0000-000000000001/general/readme.md',
  'default category used when omitted'
);

-- get_user_file_path: nested filename
SELECT is(
  public.get_user_file_path('00000000-0000-0000-0000-000000000001', 'a/b/c.png', 'assets'),
  '00000000-0000-0000-0000-000000000001/assets/a/b/c.png',
  'nested filename preserved'
);

-- get_user_file_path: empty filename current behavior
SELECT is(
  public.get_user_file_path('00000000-0000-0000-0000-000000000001', '', 'images'),
  '00000000-0000-0000-0000-000000000001/images/',
  'empty filename yields trailing slash (documenting current behavior)'
);

-- validate_user_file_path: allows own prefix
SELECT is(
  public.validate_user_file_path('00000000-0000-0000-0000-000000000001/images/file.txt', '00000000-0000-0000-0000-000000000001'),
  true,
  'validate allows own prefix'
);

-- validate_user_file_path: rejects other user
SELECT is(
  public.validate_user_file_path('00000000-0000-0000-0000-000000000002/images/file.txt', '00000000-0000-0000-0000-000000000001'),
  false,
  'validate rejects other user prefix'
);

-- validate_user_file_path: rejects without user prefix
SELECT is(
  public.validate_user_file_path('images/file.txt', '00000000-0000-0000-0000-000000000001'),
  false,
  'validate rejects paths without leading user id'
);

-- validate_user_file_path: requires at least one char after slash
SELECT is(
  public.validate_user_file_path('00000000-0000-0000-0000-000000000001/', '00000000-0000-0000-0000-000000000001'),
  true,
  'validate allows bare user prefix (documents current behavior)'
);

-- validate_user_file_path: does not sanitize traversal (documents behavior)
SELECT is(
  public.validate_user_file_path('00000000-0000-0000-0000-000000000001/../file.txt', '00000000-0000-0000-0000-000000000001'),
  true,
  'validate matches simple prefix only (no path normalization)'
);

SELECT * FROM finish();
ROLLBACK;


