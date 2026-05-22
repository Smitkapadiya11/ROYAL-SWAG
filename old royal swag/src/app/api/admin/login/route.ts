import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function verifyPassword(input: string): boolean {
  const adminPass = process.env.ADMIN_PASSWORD?.trim()
  const adminHash = process.env.ADMIN_PASSWORD_HASH?.trim()

  // username check not needed here — done by caller
  // support both plain password and hash
  if (adminHash) {
    const inputHash = crypto.createHash('sha256').update(input).digest('hex')
    return inputHash === adminHash
  }
  if (adminPass) {
    return input === adminPass
  }
  return false
}

function issueToken(username: string): string {
  const secret = (process.env.ADMIN_SECRET_KEY || '').trim().replace(/^["']|["']$/g, '')
  const payload = `${username}:${Date.now()}`
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return Buffer.from(`${payload}:${sig}`).toString('base64')
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    const adminUser = (process.env.ADMIN_USERNAME || 'admin').trim()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    if (username !== adminUser || !verifyPassword(password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = issueToken(username)

    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
