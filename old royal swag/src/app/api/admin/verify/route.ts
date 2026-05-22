import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function verifyToken(token: string): boolean {
  try {
    const secret = (process.env.ADMIN_SECRET_KEY || '').trim().replace(/^["']|["']$/g, '')
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const parts = decoded.split(':')
    if (parts.length !== 3) return false
    const [username, timestamp, sig] = parts
    const payload = `${username}:${timestamp}`
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    return sig === expectedSig
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true })
}
