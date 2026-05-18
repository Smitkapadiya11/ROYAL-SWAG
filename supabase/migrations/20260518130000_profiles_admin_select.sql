-- Allow admin to list all customer profiles in /admin dashboard
DROP POLICY IF EXISTS profiles_admin_select ON public.profiles;
CREATE POLICY profiles_admin_select ON public.profiles
  FOR SELECT
  USING ((auth.jwt() ->> 'email') = 'admin@eximburginternational.in');
