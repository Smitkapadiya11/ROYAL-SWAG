-- Run after PROMPT 1 migration to confirm tables, RLS, and functions
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'addresses', 'orders')
ORDER BY table_name;

SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'addresses', 'orders');

SELECT policyname, tablename, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'addresses', 'orders')
ORDER BY tablename, policyname;

SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_new_user', 'generate_order_number');

SELECT tgname
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
