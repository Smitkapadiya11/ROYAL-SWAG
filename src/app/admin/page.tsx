'use client'

import { useEffect, useState } from 'react'

type Order = {
  id: string
  name: string
  mobile: string
  email: string
  package: string
  amount: number
  status: string
  created_at: string
}

type LungTest = {
  id: string
  name: string
  mobile: string
  email: string
  risk_level: string
  score: number
  created_at: string
}

export default function AdminPage() {
  const [tab, setTab] = useState<'orders' | 'lungtests'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [lungTests, setLungTests] = useState<LungTest[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')

  function handleLogin() {
    if (password === 'royalswag2024') {
      setAuthed(true)
      setError('')
    } else {
      setError('Wrong password')
    }
  }

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch('/api/admin/data')
      .then(r => r.json())
      .then(data => {
        setOrders(data.orders || [])
        setLungTests(data.lungTests || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [authed])

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: '320px' }}>
          <h2 style={{ marginBottom: '24px', color: '#14532d', textAlign: 'center' }}>Royal Swag Admin</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '12px', fontSize: '15px', boxSizing: 'border-box' }}
          />
          {error && <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '8px' }}>{error}</p>}
          <button
            onClick={handleLogin}
            style={{ width: '100%', padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  const thStyle: React.CSSProperties = { background: '#14532d', color: '#fff', padding: '10px 14px', textAlign: 'left', whiteSpace: 'nowrap' }
  const tdStyle: React.CSSProperties = { padding: '10px 14px', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: '24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ color: '#14532d', marginBottom: '24px' }}>Royal Swag — Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {(['orders', 'lungtests'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: tab === t ? '#16a34a' : '#fff', color: tab === t ? '#fff' : '#16a34a', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              {t === 'orders' ? `Orders (${orders.length})` : `Lung Tests (${lungTests.length})`}
            </button>
          ))}
        </div>
        {loading ? (
          <p style={{ color: '#6b7280' }}>Loading...</p>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', overflow: 'auto', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {tab === 'orders' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['#','Name','Mobile','Email','Package','Amount','Status','Date'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && <tr><td colSpan={8} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>No orders yet</td></tr>}
                  {orders.map((o, i) => (
                    <tr key={o.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={tdStyle}>{i + 1}</td>
                      <td style={tdStyle}>{o.name}</td>
                      <td style={tdStyle}>{o.mobile}</td>
                      <td style={tdStyle}>{o.email}</td>
                      <td style={tdStyle}>{o.package}</td>
                      <td style={tdStyle}>₹{o.amount}</td>
                      <td style={tdStyle}>
                        <span style={{ background: o.status === 'pending' ? '#fef3c7' : '#dcfce7', color: o.status === 'pending' ? '#92400e' : '#14532d', padding: '2px 8px', borderRadius: '99px', fontSize: '12px' }}>{o.status}</span>
                      </td>
                      <td style={tdStyle}>{new Date(o.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === 'lungtests' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['#','Name','Mobile','Email','Risk Level','Score','Date'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {lungTests.length === 0 && <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>No lung tests yet</td></tr>}
                  {lungTests.map((l, i) => (
                    <tr key={l.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={tdStyle}>{i + 1}</td>
                      <td style={tdStyle}>{l.name}</td>
                      <td style={tdStyle}>{l.mobile}</td>
                      <td style={tdStyle}>{l.email}</td>
                      <td style={tdStyle}>
                        <span style={{ background: l.risk_level === 'High' ? '#fee2e2' : l.risk_level === 'Moderate' ? '#fef3c7' : '#dcfce7', color: l.risk_level === 'High' ? '#991b1b' : l.risk_level === 'Moderate' ? '#92400e' : '#14532d', padding: '2px 8px', borderRadius: '99px', fontSize: '12px' }}>{l.risk_level}</span>
                      </td>
                      <td style={tdStyle}>{l.score}</td>
                      <td style={tdStyle}>{new Date(l.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
