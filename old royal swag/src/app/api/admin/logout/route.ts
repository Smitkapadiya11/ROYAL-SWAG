import { NextResponse } from 'next/server'
import { logAdminEnvCheck } from '@/lib/admin/env-check'

export async function POST() {
  logAdminEnvCheck()
  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return res
}
