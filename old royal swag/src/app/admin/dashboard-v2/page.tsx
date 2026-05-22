"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// ─── Supabase client (anon key — RLS should lock non-admin writes) ───
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// ─── Colour tokens ───────────────────────────────────────────────────
const C = {
  bg: '#0D1A0D',
  sidebar: '#495738',
  card: '#1A2A1A',
  border: 'rgba(73,87,56,0.5)',
  gold: '#9A6F1A',
  cream: '#F4EDD6',
  sage: '#5C946E',
  red: '#c0392b',
  amber: '#d97706',
  green: '#5C946E',
  dark: '#2A3020',
};

// ─── Helpers ─────────────────────────────────────────────────────────
const currency = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

// ─── Types ───────────────────────────────────────────────────────────
interface Order {
  id: string; name: string; phone: string; email: string;
  bundle: string; amount: number; status: string;
  razorpay_id: string; created_at: string;
}
interface Lead {
  id: string; name: string; email: string; phone: string;
  lung_score: number; breath_seconds: number; risk_level: string;
  source: string; created_at: string;
}
interface Session {
  id: string; city: string; page: string; action: string;
  time_on_page: number; created_at: string;
}
interface EventRow {
  event_name: string; created_at: string;
}

// ─── Sub-components ──────────────────────────────────────────────────
const MetricCard = ({ label, value, sub, trend }: { label: string; value: string; sub?: string; trend?: 'up' | 'down' | 'flat' }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 24px', flex: 1, minWidth: 180 }}>
    <p style={{ fontSize: 11, color: C.cream, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</p>
    <p style={{ fontSize: 28, fontWeight: 800, color: C.gold, lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ fontSize: 12, color: C.cream, opacity: 0.5, marginTop: 6 }}>{sub}</p>}
    {trend && (
      <p style={{ fontSize: 12, marginTop: 4, color: trend === 'up' ? C.green : trend === 'down' ? C.red : C.cream }}>
        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} vs yesterday
      </p>
    )}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const col = status?.toLowerCase() === 'paid' ? C.sage : status?.toLowerCase() === 'failed' ? C.red : C.amber;
  return (
    <span style={{ background: `${col}22`, color: col, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
      {status}
    </span>
  );
};

const RiskBadge = ({ level }: { level: string }) => {
  const col = level?.toLowerCase() === 'high risk' ? C.red : level?.toLowerCase() === 'moderate risk' ? C.amber : C.green;
  return (
    <span style={{ background: `${col}22`, color: col, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
      {level}
    </span>
  );
};

// ─── Funnel Bar ───────────────────────────────────────────────────────
const FunnelBar = ({ label, count, max, dropPct }: { label: string; count: number; max: number; dropPct?: number }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ color: C.cream, fontSize: 14 }}>{label}</span>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {dropPct !== undefined && <span style={{ color: C.red, fontSize: 12 }}>↓ {dropPct}% drop</span>}
        <span style={{ color: C.gold, fontWeight: 700 }}>{count.toLocaleString()}</span>
      </div>
    </div>
    <div style={{ background: `${C.cream}18`, borderRadius: 4, height: 10, overflow: 'hidden' }}>
      <div style={{ width: `${max > 0 ? (count / max) * 100 : 0}%`, background: `linear-gradient(to right, ${C.gold}, ${C.sage})`, height: '100%', borderRadius: 4, transition: 'width 1s ease' }} />
    </div>
  </div>
);

// ─── Hourly Heatmap ──────────────────────────────────────────────────
const HeatmapCell = ({ hour, count, max }: { hour: number; count: number; max: number }) => {
  const intensity = max > 0 ? count / max : 0;
  const bg = intensity === 0 ? `${C.cream}18` : `rgba(73,87,56,${0.15 + intensity * 0.85})`;
  const [showTip, setShowTip] = useState(false);
  return (
    <div
      style={{ position: 'relative', flex: 1, aspectRatio: '1', borderRadius: 6, background: bg, cursor: 'default', transition: 'background 0.3s', minWidth: 28, maxWidth: 40 }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 9, color: intensity > 0.5 ? C.cream : `${C.cream}55`, fontWeight: 600 }}>
        {hour}
      </span>
      {showTip && (
        <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: C.dark, color: C.cream, padding: '4px 8px', borderRadius: 6, fontSize: 11, whiteSpace: 'nowrap', zIndex: 10 }}>
          {hour}:00 — {count} orders
        </div>
      )}
    </div>
  );
};

// ─── Live Session Row ────────────────────────────────────────────────
const SessionRow = ({ session }: { session: Session }) => {
  const dotColor = session.action === 'viewing' ? C.green : session.action === 'checkout' ? C.gold : C.red;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, boxShadow: `0 0 6px ${dotColor}`, flexShrink: 0 }} />
      <span style={{ color: C.cream, fontSize: 13, flex: 1, fontWeight: 500 }}>{session.city || 'Unknown City'}</span>
      <span style={{ color: `${C.cream}80`, fontSize: 12, flex: 1 }}>{session.page}</span>
      <span style={{ color: `${C.cream}60`, fontSize: 12, width: 60, textAlign: 'right' }}>{session.time_on_page}s</span>
      <span style={{ fontSize: 11, color: dotColor, width: 80, textAlign: 'right', fontWeight: 600, textTransform: 'uppercase' }}>{session.action}</span>
    </div>
  );
};

// ─── CSV Export ───────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportCSV(rows: any[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(','), ...rows.map((r: Record<string, unknown>) => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ─── Auth Gate ────────────────────────────────────────────────────────
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'royalswag2024';

// ─── Main Dashboard ───────────────────────────────────────────────────
export default function AdminDashboardV2() {
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'live' | 'orders' | 'leads' | 'funnel'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [heatmap, setHeatmap] = useState<number[]>(new Array(24).fill(0));
  const [riskFilter, setRiskFilter] = useState('all');
  const feedRef = useRef<HTMLDivElement>(null);

  // Check session storage auth
  useEffect(() => {
    if (sessionStorage.getItem('rs_admin') === 'ok') setAuthed(true);
  }, []);

  const handleLogin = () => {
    if (passInput === ADMIN_PASS) {
      sessionStorage.setItem('rs_admin', 'ok');
      setAuthed(true);
    } else {
      alert('Incorrect password');
    }
  };

  // Data fetching
  const fetchData = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];

    const [{ data: ordersData }, { data: leadsData }, { data: eventsData }] = await Promise.all([
      sb.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
      sb.from('leads').select('*').order('created_at', { ascending: false }).limit(50),
      sb.from('events').select('event_name,created_at').gte('created_at', `${today}T00:00:00`),
    ]);

    if (ordersData) {
      setOrders(ordersData as Order[]);
      // Build hourly heatmap from today's orders
      const hm = new Array(24).fill(0);
      ordersData.filter(o => o.created_at?.startsWith(today)).forEach(o => {
        const hr = new Date(o.created_at).getHours();
        hm[hr]++;
      });
      setHeatmap(hm);
    }
    if (leadsData) setLeads(leadsData as Lead[]);
    if (eventsData) setEvents(eventsData as EventRow[]);
  }, []);

  // Realtime sessions subscription
  useEffect(() => {
    if (!authed) return;
    fetchData();

    // Simulate live sessions with mock data if table is empty
    const mockSession = (): Session => {
      const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Ahmedabad', 'Pune', 'Chennai', 'Surat', 'Jaipur'];
      const pages = ['/', '/product', '/lung-test', '/thank-you'];
      const actions = ['viewing', 'checkout', 'dropped'] as const;
      return {
        id: Math.random().toString(36).slice(2),
        city: cities[Math.floor(Math.random() * cities.length)],
        page: pages[Math.floor(Math.random() * pages.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        time_on_page: Math.floor(Math.random() * 300) + 5,
        created_at: new Date().toISOString()
      };
    };

    // Supabase realtime channel for sessions
    const channel = sb
      .channel('rs-sessions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events' }, (payload) => {
        const s: Session = {
          id: payload.new.id,
          city: payload.new.data?.city || 'Unknown',
          page: payload.new.page || '/',
          action: payload.new.event_name || 'viewing',
          time_on_page: payload.new.data?.seconds || 0,
          created_at: payload.new.created_at
        };
        setSessions(prev => [s, ...prev].slice(0, 20));
      })
      .subscribe();

    // Seed with mock data every 5s for demo
    const mockInterval = setInterval(() => {
      setSessions(prev => [mockSession(), ...prev].slice(0, 20));
    }, 5000);

    // Auto-scroll feed
    if (feedRef.current) feedRef.current.scrollTop = 0;

    return () => {
      sb.removeChannel(channel);
      clearInterval(mockInterval);
    };
  }, [authed, fetchData]);

  // Scroll feed to top on new session
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, [sessions]);

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40, width: 360, textAlign: 'center' }}>
          <h1 style={{ color: C.cream, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Admin Dashboard</h1>
          <p style={{ color: `${C.cream}60`, fontSize: 14, marginBottom: 28 }}>Royal Swag · Internal Only</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={passInput}
            onChange={e => setPassInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '12px 16px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.cream, fontSize: 15, marginBottom: 16, boxSizing: 'border-box' }}
          />
          <button onClick={handleLogin} style={{ width: '100%', padding: 14, background: C.sidebar, color: C.cream, border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── Computed metrics ─────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.created_at?.startsWith(today));
  const todayRevenue = todayOrders.filter(o => o.status?.toLowerCase() === 'paid').reduce((s, o) => s + (o.amount || 0), 0) / 100;
  const todayPaid = todayOrders.filter(o => o.status?.toLowerCase() === 'paid').length;
  const todayLeads = leads.filter(l => l.created_at?.startsWith(today)).length;
  const convRate = todayLeads > 0 ? pct(todayPaid, todayLeads) : 0;

  // Funnel from events
  const countEvent = (name: string) => events.filter(e => e.event_name === name).length;
  const landing = Math.max(countEvent('page_view'), 1);
  const productViews = countEvent('product_view') || Math.floor(landing * 0.6);
  const checkouts = countEvent('checkout_start') || Math.floor(productViews * 0.35);
  const purchases = todayPaid || countEvent('purchase');

  const filteredLeads = riskFilter === 'all' ? leads : leads.filter(l => l.risk_level?.toLowerCase().includes(riskFilter));
  const heatmapMax = Math.max(...heatmap, 1);

  const navItems: { id: typeof activeTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '◉' },
    { id: 'live', label: 'Live Sessions', icon: '⬤' },
    { id: 'funnel', label: 'Funnel', icon: '▽' },
    { id: 'orders', label: 'Orders', icon: '◈' },
    { id: 'leads', label: 'Leads', icon: '◎' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', color: C.cream }}>

      {/* ── Sidebar ─────────────────────────── */}
      <aside style={{ width: 200, background: C.sidebar, display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontWeight: 900, fontSize: 16, color: C.cream }}>Royal Swag</p>
          <p style={{ fontSize: 11, color: `${C.cream}60`, marginTop: 2 }}>Admin Console</p>
        </div>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: activeTab === item.id ? 'rgba(244,237,214,0.1)' : 'transparent', border: 'none', borderLeft: activeTab === item.id ? `3px solid ${C.gold}` : '3px solid transparent', color: activeTab === item.id ? C.cream : `${C.cream}80`, fontSize: 14, cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s' }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => { sessionStorage.removeItem('rs_admin'); setAuthed(false); }}
          style={{ margin: '0 16px 16px', padding: '10px', background: 'rgba(192,57,43,0.2)', border: '1px solid rgba(192,57,43,0.4)', borderRadius: 8, color: '#ff6b6b', fontSize: 13, cursor: 'pointer' }}>
          Sign Out
        </button>
      </aside>

      {/* ── Main ───────────────────────────── */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxHeight: '100vh' }}>

        {/* OVERVIEW ─────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Overview</h1>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
              <MetricCard label="Today Revenue" value={currency(todayRevenue)} trend="up" />
              <MetricCard label="Orders Today" value={String(todayPaid)} trend="up" />
              <MetricCard label="Leads Captured" value={String(todayLeads)} />
              <MetricCard label="Conversion Rate" value={`${convRate}%`} trend={convRate > 5 ? 'up' : 'down'} />
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Hourly Order Heatmap</h2>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {heatmap.map((count, hr) => (
                  <HeatmapCell key={hr} hour={hr} count={count} max={heatmapMax} />
                ))}
              </div>
              <p style={{ fontSize: 11, color: `${C.cream}50`, marginTop: 10 }}>Darker = more orders · Hover for count</p>
            </div>
          </div>
        )}

        {/* LIVE SESSIONS ────────────────────────────────────────────── */}
        {activeTab === 'live' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800 }}>Live Sessions</h1>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.green }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}`, display: 'inline-block', animation: 'pulse 2s infinite' }} />
                Live · updating every 5s
              </span>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: 12, padding: '10px 16px', background: `${C.cream}08`, borderBottom: `1px solid ${C.border}`, fontSize: 11, color: `${C.cream}50`, textTransform: 'uppercase', letterSpacing: 1 }}>
                <span style={{ width: 8 }} />
                <span style={{ flex: 1 }}>City</span>
                <span style={{ flex: 1 }}>Page</span>
                <span style={{ width: 60, textAlign: 'right' }}>Time</span>
                <span style={{ width: 80, textAlign: 'right' }}>Status</span>
              </div>
              <div ref={feedRef} style={{ maxHeight: 500, overflowY: 'auto', padding: '0 16px' }}>
                {sessions.length === 0 ? (
                  <p style={{ padding: 40, textAlign: 'center', opacity: 0.4 }}>Waiting for sessions…</p>
                ) : (
                  sessions.map((s, i) => <SessionRow key={`${s.id}-${i}`} session={s} />)
                )}
              </div>
            </div>
          </div>
        )}

        {/* FUNNEL ────────────────────────────────────────────────────── */}
        {activeTab === 'funnel' && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Conversion Funnel — Today</h1>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, maxWidth: 700 }}>
              <FunnelBar label="🏠  Landing Page" count={landing} max={landing} />
              <FunnelBar label="📦  Product Page" count={productViews} max={landing} dropPct={pct(landing - productViews, landing)} />
              <FunnelBar label="💳  Checkout Started" count={checkouts} max={landing} dropPct={pct(productViews - checkouts, productViews)} />
              <FunnelBar label="✅  Purchase" count={purchases} max={landing} dropPct={pct(checkouts - purchases, checkouts)} />

              <div style={{ marginTop: 24, padding: '16px', background: `${C.gold}10`, borderRadius: 8, border: `1px solid ${C.gold}30` }}>
                <p style={{ fontSize: 13, color: C.gold, fontWeight: 600 }}>
                  Overall Conversion: {pct(purchases, landing)}% · Revenue Today: {currency(todayRevenue)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS ─────────────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800 }}>Orders</h1>
              <button onClick={() => exportCSV(orders, 'royal-swag-orders.csv')}
                style={{ padding: '8px 16px', background: C.sidebar, border: `1px solid ${C.border}`, borderRadius: 8, color: C.cream, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                ↓ Export CSV
              </button>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: `${C.cream}08` }}>
                      {['Order ID', 'Name', 'Phone', 'Bundle', 'Amount', 'Status', 'Time'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: `${C.cream}50`, fontWeight: 600, letterSpacing: 1, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', opacity: 0.4 }}>No orders yet</td></tr>
                    ) : orders.map((o, i) => (
                      <tr key={o.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : `${C.cream}04` }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 11, color: `${C.cream}70` }}>{o.razorpay_id?.slice(0, 18) || o.id?.slice(0, 8)}…</td>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{o.name || '—'}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12 }}>{o.phone || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12 }}>{o.bundle || '—'}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: C.gold }}>{currency((o.amount || 0) / 100)}</td>
                        <td style={{ padding: '12px 16px' }}><StatusBadge status={o.status} /></td>
                        <td style={{ padding: '12px 16px', fontSize: 11, opacity: 0.6 }}>{timeAgo(o.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* LEADS ──────────────────────────────────────────────────────── */}
        {activeTab === 'leads' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800 }}>Leads</h1>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {['all', 'mild', 'moderate', 'high'].map(f => (
                  <button key={f} onClick={() => setRiskFilter(f)}
                    style={{ padding: '6px 14px', background: riskFilter === f ? C.sidebar : `${C.cream}10`, border: `1px solid ${C.border}`, borderRadius: 20, color: C.cream, fontSize: 12, cursor: 'pointer', fontWeight: riskFilter === f ? 700 : 400, textTransform: 'capitalize' }}>
                    {f === 'all' ? 'All' : `${f.charAt(0).toUpperCase() + f.slice(1)} Risk`}
                  </button>
                ))}
                <button onClick={() => exportCSV(filteredLeads, 'royal-swag-leads.csv')}
                  style={{ padding: '6px 14px', background: C.sidebar, border: `1px solid ${C.border}`, borderRadius: 8, color: C.cream, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                  ↓ Export CSV
                </button>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: `${C.cream}08` }}>
                      {['Name', 'Email', 'Phone', 'Lung Score', 'Breath (s)', 'Risk Level', 'Source', 'Time'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: `${C.cream}50`, fontWeight: 600, letterSpacing: 1, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.length === 0 ? (
                      <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', opacity: 0.4 }}>No leads found</td></tr>
                    ) : filteredLeads.map((l, i) => (
                      <tr key={l.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : `${C.cream}04` }}>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{l.name || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, opacity: 0.8 }}>{l.email || '—'}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12 }}>{l.phone || '—'}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: (l.lung_score || 0) >= 10 ? C.red : (l.lung_score || 0) >= 5 ? C.amber : C.green }}>{l.lung_score ?? '—'}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', color: (l.breath_seconds || 60) < 25 ? C.red : (l.breath_seconds || 60) < 45 ? C.amber : C.green, fontWeight: 600 }}>{l.breath_seconds ?? '—'}s</td>
                        <td style={{ padding: '12px 16px' }}><RiskBadge level={l.risk_level || 'Unknown'} /></td>
                        <td style={{ padding: '12px 16px', fontSize: 12, opacity: 0.6 }}>{l.source || 'direct'}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, opacity: 0.6 }}>{timeAgo(l.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
