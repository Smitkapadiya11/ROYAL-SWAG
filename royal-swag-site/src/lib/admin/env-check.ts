/** Log Supabase env presence — check Vercel Function logs after deploy. */
export function logAdminEnvCheck() {
  console.log("ENV CHECK:", {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    keyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20),
  });
}
