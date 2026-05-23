"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import MetricCard from "./MetricCard";
import { csvDateFilename, downloadCsv } from "@/lib/admin/export-csv";
import { cn } from "@/lib/utils";

type Lead = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  risk_level: string;
  city: string;
  score: number;
  created_at: string;
};

const PAGE_SIZE = 20;
const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error("Failed to load leads");
    return r.json() as Promise<{ leads: Lead[] }>;
  });

function riskBadge(level: string) {
  const l = level.toLowerCase();
  if (l === "mild")
    return "bg-green-100 text-green-900";
  if (l === "moderate")
    return "bg-amber-100 text-amber-900";
  if (l === "high")
    return "bg-red-100 text-red-900";
  return "bg-gray-100 text-gray-800";
}

function waLink(mobile: string) {
  const digits = mobile.replace(/\D/g, "").slice(-10);
  return `https://wa.me/91${digits}`;
}

export default function LungTestLeadsSection() {
  const { data, error, isLoading } = useSWR("/api/admin/phase1/leads", fetcher);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [page, setPage] = useState(0);

  const leads = data?.leads ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (riskFilter !== "all" && l.risk_level.toLowerCase() !== riskFilter) {
        return false;
      }
      const t = new Date(l.created_at).getTime();
      if (dateFrom && t < new Date(dateFrom).setHours(0, 0, 0, 0)) return false;
      if (dateTo && t > new Date(dateTo).setHours(23, 59, 59, 999)) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.mobile.includes(q)
      );
    });
  }, [leads, search, dateFrom, dateTo, riskFilter]);

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const stats = useMemo(
    () => ({
      total: leads.length,
      today: leads.filter((l) => new Date(l.created_at).getTime() >= todayStart)
        .length,
      high: leads.filter((l) => l.risk_level.toLowerCase() === "high").length,
    }),
    [leads, todayStart]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const exportCsv = () => {
    const rows: string[][] = [
      ["Name", "Email", "Mobile", "Risk Level", "City", "Score", "Date"],
      ...filtered.map((l) => [
        l.name,
        l.email,
        l.mobile,
        l.risk_level,
        l.city,
        String(l.score),
        l.created_at,
      ]),
    ];
    downloadCsv(rows, csvDateFilename("leads"));
  };

  const inputClass =
    "rounded-lg border border-primary/15 bg-white/70 px-3 py-2 font-body text-sm text-primary outline-none focus:border-primary/40";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Total Leads" value={stats.total} />
        <MetricCard label="Today's Leads" value={stats.today} />
        <MetricCard label="High Risk Count" value={stats.high} />
      </div>

      <div className="glass-card flex flex-wrap items-end gap-3 rounded-2xl p-4">
        <label className="flex min-w-[180px] flex-1 flex-col gap-1 font-body text-xs text-on-surface-variant">
          Search
          <input
            type="search"
            placeholder="Name, email, mobile…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 font-body text-xs text-on-surface-variant">
          From
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(0);
            }}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 font-body text-xs text-on-surface-variant">
          To
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(0);
            }}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 font-body text-xs text-on-surface-variant">
          Risk
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setPage(0);
            }}
            className={inputClass}
          >
            <option value="all">All</option>
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </label>
        <button type="button" onClick={exportCsv} className="btn-primary">
          Download CSV
        </button>
      </div>

      {isLoading && (
        <p className="font-body text-sm text-on-surface-variant">Loading leads…</p>
      )}
      {error && (
        <p className="font-body text-sm text-red-700">Could not load leads.</p>
      )}

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="bg-primary font-body text-xs uppercase tracking-wide text-white">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3" title="Urban pollution exposure (quiz)">
                  City
                </th>
                <th className="px-4 py-3">Date &amp; Time</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((l) => (
                <tr
                  key={l.id}
                  className="border-t border-white/50 font-body text-sm text-primary transition-colors hover:bg-white/60"
                >
                  <td className="px-4 py-3 font-medium">{l.name}</td>
                  <td className="px-4 py-3">{l.email}</td>
                  <td className="px-4 py-3">
                    <a
                      href={waLink(l.mobile)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold underline-offset-2 hover:underline"
                    >
                      {l.mobile}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        riskBadge(l.risk_level)
                      )}
                    >
                      {l.risk_level}
                    </span>
                  </td>
                  <td className="px-4 py-3">{l.city}</td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {new Date(l.created_at).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
              {!isLoading && pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-on-surface-variant">
                    No leads match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-white/50 px-4 py-3 font-body text-sm">
          <span className="text-on-surface-variant">
            {filtered.length} lead{filtered.length === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-primary/20 px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 py-1 text-on-surface-variant">
              {page + 1} / {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-primary/20 px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
