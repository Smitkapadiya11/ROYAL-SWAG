"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

function formatTime(timestamp) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function OverviewTab() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, leads: 0, conversion: 0 });
  const [hourlyData, setHourlyData] = useState(Array(24).fill(0));

  useEffect(() => {
    async function fetchStats() {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: orders } = await supabase
        .from('orders')
        .select('amount, status, created_at')
        .gte('created_at', today)
        .eq('status', 'paid');
      
      const { count: leadCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);
      
      const { data: events, count: pageViews } = await supabase
        .from('events')
        .select('created_at, event_name', { count: 'exact' })
        .gte('created_at', today);
      
      const totalRevenue = orders?.reduce((sum, o) => sum + o.amount, 0) / 100 || 0;
      const orderCount = orders?.length || 0;
      
      const views = events?.filter(e => e.event_name === 'page_view').length || pageViews || 0;
      const convRate = views > 0 ? ((orderCount / views) * 100).toFixed(1) : 0;
      
      setStats({ revenue: totalRevenue, orders: orderCount, leads: leadCount || 0, conversion: convRate });

      // Hourly Heatmap calculation
      if (events) {
        const hours = Array(24).fill(0);
        events.forEach(e => {
          const hour = new Date(e.created_at).getHours();
          hours[hour]++;
        });
        setHourlyData(hours);
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const maxHourVal = Math.max(...hourlyData, 1);

  return (
    <div>
      <h2 style={{ fontSize: 28, marginBottom: 24, fontWeight: 'bold' }}>Overview (Today)</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
        <StatCard label="Today Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} />
        <StatCard label="Orders Today" value={stats.orders} />
        <StatCard label="Leads Captured" value={stats.leads} />
        <StatCard label="Conversion Rate" value={`${stats.conversion}%`} />
      </div>

      <div style={{ background: '#1A2A1A', border: '1px solid #49573850', borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: 16, color: '#F4EDD680', marginBottom: 16 }}>Hourly Activity Heatmap</h3>
        <div style={{ display: 'flex', gap: 4, height: 40, alignItems: 'flex-end' }}>
          {hourlyData.map((val, i) => {
            const intensity = val / maxHourVal; // 0 to 1
            // mix #1A2A1A to #9A6F1A roughly by opacity
            return (
              <div 
                key={i} 
                title={`${val} events at ${i}:00`}
                style={{
                  flex: 1, 
                  height: '100%', 
                  background: '#9A6F1A', 
                  opacity: 0.1 + (intensity * 0.9),
                  borderRadius: 4
                }}
              />
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#F4EDD650' }}>
          <span>12 AM</span>
          <span>12 PM</span>
          <span>11 PM</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: '#1A2A1A', border: '1px solid #49573850', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#9A6F1A', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#F4EDD680', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

function LiveFeedTab() {
  const [liveFeed, setLiveFeed] = useState([]);

  useEffect(() => {
    // Fetch initial
    supabase.from('events').select('*').order('created_at', { ascending: false }).limit(50)
      .then(({data}) => setLiveFeed(data || []));

    const channel = supabase
      .channel('live-events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'events' }, (payload) => {
        setLiveFeed(prev => [payload.new, ...prev].slice(0, 50));
      })
      .subscribe();
      
    return () => supabase.removeChannel(channel);
  }, []);

  function getStatusColor(event) {
    if (event.event_name === 'purchase') return '#5C946E';
    if (event.event_name === 'checkout_init') return '#9A6F1A';
    if (event.event_name === 'page_view') return '#49573880';
    return '#F4EDD650';
  }

  return (
    <div>
      <h2 style={{ fontSize: 28, marginBottom: 24, fontWeight: 'bold' }}>Live Session Feed</h2>
      <div style={{ background: '#1A2A1A', border: '1px solid #49573850', borderRadius: 12, padding: 24 }}>
        {liveFeed.map(event => (
          <div key={event.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #49573830', fontSize: 14 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: getStatusColor(event), marginTop: 4, flexShrink: 0 }} />
            <span style={{ color: '#9A6F1A', minWidth: 100, fontWeight: 'bold' }}>{event.city || event.data?.city || 'Unknown'}</span>
            <span style={{ color: '#F4EDD6', flex: 1, textTransform: 'capitalize' }}>
              {(event.event_name || '').replace(/_/g, ' ')}
            </span>
            <span style={{ color: '#F4EDD650', fontSize: 12 }}>{formatTime(event.created_at)}</span>
          </div>
        ))}
        {liveFeed.length === 0 && <div style={{ color: '#F4EDD650' }}>Waiting for events...</div>}
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchOrders() {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100);
      if (filter !== 'all') query = query.eq('status', filter);
      const { data } = await query;
      setOrders(data || []);
    }
    fetchOrders();
  }, [filter]);

  function exportCSV() {
    const csv = [
      ['ID','Name','Phone','Bundle','Amount','Status','Time'],
      ...orders.map(o => [o.id.slice(0,8), o.name, o.phone, o.bundle, `₹${o.amount/100}`, o.status, new Date(o.created_at).toLocaleString('en-IN')])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `orders-${Date.now()}.csv`; a.click();
  }

  const getStatusColor = (status) => {
    if (status === 'paid') return '#5C946E';
    if (status === 'pending') return '#9A6F1A';
    if (status === 'failed') return '#E24B4A';
    return '#F4EDD650';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 'bold' }}>Orders</h2>
        <button onClick={exportCSV} style={{ background: '#495738', color: '#F4EDD6', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>Export CSV</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'paid', 'pending', 'failed'].map(f => (
          <button 
            key={f} onClick={() => setFilter(f)}
            style={{ 
              background: filter === f ? '#9A6F1A' : '#1A2A1A', 
              color: '#F4EDD6', border: '1px solid #49573850', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', textTransform: 'capitalize' 
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ background: '#1A2A1A', border: '1px solid #49573850', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#49573840', color: '#F4EDD680', textTransform: 'uppercase', fontSize: 12 }}>
              <th style={{ padding: 16 }}>Order ID</th>
              <th style={{ padding: 16 }}>Name</th>
              <th style={{ padding: 16 }}>Phone</th>
              <th style={{ padding: 16 }}>Bundle</th>
              <th style={{ padding: 16 }}>Amount</th>
              <th style={{ padding: 16 }}>Status</th>
              <th style={{ padding: 16 }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderTop: '1px solid #49573830' }}>
                <td style={{ padding: 16, color: '#9A6F1A', fontFamily: 'monospace' }}>{o.id.slice(0,8)}</td>
                <td style={{ padding: 16 }}>{o.name || '-'}</td>
                <td style={{ padding: 16 }}>{o.phone || '-'}</td>
                <td style={{ padding: 16 }}>{o.bundle || '-'}</td>
                <td style={{ padding: 16, fontWeight: 'bold' }}>₹{o.amount / 100}</td>
                <td style={{ padding: 16 }}>
                  <span style={{ background: getStatusColor(o.status), padding: '4px 10px', borderRadius: 12, fontSize: 11, color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: 16, color: '#F4EDD650' }}>{new Date(o.created_at).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: '#F4EDD650' }}>No orders found.</div>}
      </div>
    </div>
  );
}

function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchLeads() {
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(100);
      if (filter !== 'all') {
        const riskMap = { 'mild': 'Mild', 'moderate': 'Moderate', 'high': 'High Risk' };
        query = query.eq('risk_level', riskMap[filter] || filter);
      }
      const { data } = await query;
      setLeads(data || []);
    }
    fetchLeads();
  }, [filter]);

  const getRiskColor = (risk) => {
    if (risk === 'Mild') return '#5C946E';
    if (risk === 'Moderate') return '#9A6F1A';
    if (risk === 'High Risk') return '#E24B4A';
    return '#495738';
  };

  return (
    <div>
      <h2 style={{ fontSize: 28, marginBottom: 24, fontWeight: 'bold' }}>Leads Captured</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'mild', 'moderate', 'high'].map(f => (
          <button 
            key={f} onClick={() => setFilter(f)}
            style={{ 
              background: filter === f ? '#9A6F1A' : '#1A2A1A', 
              color: '#F4EDD6', border: '1px solid #49573850', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', textTransform: 'capitalize' 
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ background: '#1A2A1A', border: '1px solid #49573850', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#49573840', color: '#F4EDD680', textTransform: 'uppercase', fontSize: 12 }}>
              <th style={{ padding: 16 }}>Name</th>
              <th style={{ padding: 16 }}>Contact</th>
              <th style={{ padding: 16 }}>Lung Score</th>
              <th style={{ padding: 16 }}>Breath Hold</th>
              <th style={{ padding: 16 }}>Risk Level</th>
              <th style={{ padding: 16 }}>Source</th>
              <th style={{ padding: 16 }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(l => (
              <tr key={l.id} style={{ borderTop: '1px solid #49573830' }}>
                <td style={{ padding: 16, fontWeight: 'bold' }}>{l.name}</td>
                <td style={{ padding: 16 }}>
                  <div>{l.phone}</div>
                  <div style={{ color: '#F4EDD650', fontSize: 12 }}>{l.email}</div>
                </td>
                <td style={{ padding: 16 }}>{l.lung_score ?? '-'}</td>
                <td style={{ padding: 16 }}>{l.breath_seconds ? `${l.breath_seconds}s` : '-'}</td>
                <td style={{ padding: 16 }}>
                  {l.risk_level ? (
                    <span style={{ background: getRiskColor(l.risk_level), padding: '4px 10px', borderRadius: 12, fontSize: 11, color: 'white', fontWeight: 'bold' }}>
                      {l.risk_level}
                    </span>
                  ) : '-'}
                </td>
                <td style={{ padding: 16, color: '#9A6F1A' }}>{l.source}</td>
                <td style={{ padding: 16, color: '#F4EDD650' }}>{new Date(l.created_at).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: '#F4EDD650' }}>No leads found.</div>}
      </div>
    </div>
  );
}

function FunnelTab() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  
  const funnelSteps = [
    { label: 'Page Views', event: 'page_view', color: '#5C946E' },
    { label: 'Product Views', event: 'section_view', color: '#9A6F1A' },
    { label: 'Checkout Started', event: 'checkout_init', color: '#BA7517' },
    { label: 'Purchases', event: 'purchase', color: '#495738' },
  ];

  useEffect(() => {
    async function fetchFunnel() {
      const today = new Date().toISOString().split('T')[0];
      const newCounts = [...counts];
      
      for (let i = 0; i < funnelSteps.length; i++) {
        const { count } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('event_name', funnelSteps[i].event)
          .gte('created_at', today);
        newCounts[i] = count || 0;
      }
      setCounts(newCounts);
    }
    fetchFunnel();
  }, []);

  const maxCount = Math.max(...counts, 1);

  return (
    <div>
      <h2 style={{ fontSize: 28, marginBottom: 24, fontWeight: 'bold' }}>Funnel Drop-Off (Today)</h2>
      
      <div style={{ background: '#1A2A1A', border: '1px solid #49573850', borderRadius: 12, padding: 40 }}>
        {funnelSteps.map((step, i) => {
          const width = (counts[i] / maxCount) * 100;
          const dropPct = i > 0 && counts[i-1] > 0 ? (((counts[i-1] - counts[i]) / counts[i-1]) * 100).toFixed(0) : null;
          
          return (
            <div key={step.event} style={{ marginBottom: i === funnelSteps.length - 1 ? 0 : 32 }}>
              {i > 0 && dropPct !== null && (
                <div style={{ paddingLeft: 200, color: '#E24B4A', fontSize: 12, fontWeight: 'bold', marginBottom: 12 }}>
                  ↓ {dropPct}% drop
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ width: 160, textAlign: 'right', fontSize: 16, color: '#F4EDD680' }}>
                  {step.label}
                </div>
                <div style={{ width: 80, fontSize: 24, fontWeight: 'bold', color: step.color }}>
                  {counts[i]}
                </div>
                <div style={{ flex: 1, background: '#0A1A0A', height: 24, borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ width: `${width}%`, height: '100%', background: step.color, transition: 'width 1s ease-out' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Live Feed', 'Orders', 'Leads', 'Funnel'];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A1A0A', color: '#F4EDD6' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#495738', padding: 24, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: '#F4EDD6', marginBottom: 40, fontSize: 24, fontWeight: 900, letterSpacing: 1 }}>ROYAL SWAG<br/><span style={{fontSize: 14, color: '#9A6F1A'}}>ADMIN</span></h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tabs.map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                background: activeTab === t ? '#1A2A1A' : 'transparent',
                color: activeTab === t ? '#9A6F1A' : '#F4EDD6',
                border: 'none', padding: '12px 16px', borderRadius: 8,
                textAlign: 'left', fontWeight: 'bold', cursor: 'pointer',
                transition: 'background 0.2s', fontSize: 16
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
        {activeTab === 'Overview' && <OverviewTab />}
        {activeTab === 'Live Feed' && <LiveFeedTab />}
        {activeTab === 'Orders' && <OrdersTab />}
        {activeTab === 'Leads' && <LeadsTab />}
        {activeTab === 'Funnel' && <FunnelTab />}
      </div>
    </div>
  );
}
