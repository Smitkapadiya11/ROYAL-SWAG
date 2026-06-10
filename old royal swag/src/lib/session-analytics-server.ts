/** Server-side aggregation for customer_events + orders */

export type AnalyticsFilters = {
  dateFrom: string;
  dateTo: string;
  device: "all" | "mobile" | "desktop";
  source: string;
  pack: string;
};

export type CustomerEventRow = {
  session_id: string;
  visitor_id: string;
  page: string;
  event: string;
  event_data: Record<string, unknown>;
  city: string | null;
  device: string;
  source: string | null;
  timestamp: string;
};

export type OrderRow = {
  city: string;
  pack_type: string;
  amount: number;
  status: string;
  created_at: string;
};

function inRange(ts: string, from: string, to: string) {
  const t = new Date(ts).getTime();
  return t >= new Date(from).getTime() && t <= new Date(to).getTime();
}

function matchDevice(row: CustomerEventRow, device: string) {
  return device === "all" || row.device === device;
}

function matchSource(row: CustomerEventRow, source: string) {
  if (source === "all") return true;
  return (row.source || "direct").toLowerCase() === source.toLowerCase();
}

function eventPack(eventData: Record<string, unknown>): string | null {
  const p = eventData.pack ?? eventData.packId ?? eventData.pack_name;
  return p ? String(p).toLowerCase() : null;
}

function matchPackEvent(row: CustomerEventRow, pack: string) {
  if (pack === "all") return true;
  if (row.event === "purchase" || row.event === "add_to_cart") {
    const ep = eventPack(row.event_data);
    return ep ? ep.includes(pack.toLowerCase()) : true;
  }
  return true;
}

export function filterEvents(
  rows: CustomerEventRow[],
  filters: AnalyticsFilters
): CustomerEventRow[] {
  return rows.filter(
    (r) =>
      inRange(r.timestamp, filters.dateFrom, filters.dateTo) &&
      matchDevice(r, filters.device) &&
      matchSource(r, filters.source) &&
      matchPackEvent(r, filters.pack)
  );
}

export function filterOrders(orders: OrderRow[], filters: AnalyticsFilters, pack: string) {
  return orders.filter((o) => {
    if (!inRange(o.created_at, filters.dateFrom, filters.dateTo)) return false;
    if (pack !== "all" && !o.pack_type.toLowerCase().includes(pack.toLowerCase()))
      return false;
    return String(o.status).toLowerCase() === "paid";
  });
}

export function buildTodayFunnel(events: CustomerEventRow[]) {
  const sessions = new Set(events.map((e) => e.session_id));
  const countSessionsWith = (predicate: (e: CustomerEventRow) => boolean) => {
    const s = new Set<string>();
    events.filter(predicate).forEach((e) => s.add(e.session_id));
    return s.size;
  };

  const home = countSessionsWith(
    (e) => e.event === "page_view" && (e.page === "/" || e.page === "")
  );
  const product = countSessionsWith(
    (e) => e.event === "page_view" && e.page.includes("/product")
  );
  const cart = countSessionsWith((e) => e.event === "add_to_cart");
  const checkout = countSessionsWith((e) => e.event === "checkout_start");
  const purchase = countSessionsWith((e) => e.event === "purchase");

  const stages = [
    { stage: "Homepage", count: home },
    { stage: "Product Page", count: product },
    { stage: "Add to Cart", count: cart },
    { stage: "Checkout", count: checkout },
    { stage: "Purchase", count: purchase },
  ];

  return stages.map((s, i) => {
    const prev = i === 0 ? s.count : stages[i - 1].count;
    const dropPct =
      i === 0 || prev === 0 ? 0 : Math.round(((prev - s.count) / prev) * 100);
    return { ...s, dropPct: Math.max(0, dropPct) };
  });
}

export function buildSankeyLinks(funnel: { stage: string; count: number }[]) {
  const links: { from: string; to: string; value: number }[] = [];
  for (let i = 0; i < funnel.length - 1; i++) {
    links.push({
      from: funnel[i].stage,
      to: funnel[i + 1].stage,
      value: Math.min(funnel[i].count, funnel[i + 1].count),
    });
  }
  return links;
}

export function buildExitPages(events: CustomerEventRow[]) {
  const lastBySession = new Map<string, CustomerEventRow>();
  for (const e of events) {
    const prev = lastBySession.get(e.session_id);
    if (!prev || new Date(e.timestamp) > new Date(prev.timestamp)) {
      lastBySession.set(e.session_id, e);
    }
  }
  const counts = new Map<string, number>();
  for (const e of lastBySession.values()) {
    const p = e.page || "/";
    counts.set(p, (counts.get(p) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

export function buildDeviceSplit(events: CustomerEventRow[]) {
  let mobile = 0;
  let desktop = 0;
  const seen = new Set<string>();
  for (const e of events) {
    if (e.event !== "page_view") continue;
    const key = `${e.session_id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (e.device === "mobile") mobile++;
    else desktop++;
  }
  return [
    { name: "Mobile", value: mobile },
    { name: "Desktop", value: desktop },
  ];
}

export function buildTrafficSources(events: CustomerEventRow[]) {
  const map = new Map<string, { sessions: Set<string>; events: number }>();
  for (const e of events) {
    const src = e.source || "direct";
    if (!map.has(src)) map.set(src, { sessions: new Set(), events: 0 });
    const row = map.get(src)!;
    row.sessions.add(e.session_id);
    row.events++;
  }
  return [...map.entries()]
    .map(([source, v]) => ({
      source,
      sessions: v.sessions.size,
      events: v.events,
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

export function buildCityOrders(orders: OrderRow[]) {
  const map = new Map<string, number>();
  for (const o of orders) {
    const c = o.city || "Unknown";
    map.set(c, (map.get(c) || 0) + 1);
  }
  return [...map.entries()]
    .map(([city, orders]) => ({ city, orders }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 10);
}

export function buildPeakHours(orders: OrderRow[]) {
  const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, orders: 0 }));
  for (const o of orders) {
    const h = new Date(o.created_at).getHours();
    hours[h].orders++;
  }
  return hours;
}

export function listDistinctSources(events: CustomerEventRow[]): string[] {
  const s = new Set<string>();
  events.forEach((e) => s.add(e.source || "direct"));
  return [...s].sort();
}
