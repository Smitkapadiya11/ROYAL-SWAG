"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
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

const inputClass =
  "rounded-xl border border-[#324023]/30 bg-[#F4EDD6] px-4 py-2 font-sans text-sm text-[#171e11] placeholder:text-[#75786e] focus:border-[#9A6F1A] focus:outline-none focus:ring-2 focus:ring-[#9A6F1A]/20";

function riskBadge(level: string) {
  const l = level.toLowerCase();
  if (l === "mild") return "bg-green-100 text-green-800";
  if (l === "moderate") return "bg-amber-100 text-amber-800";
  if (l === "high") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
}

function waLink(mobile: string) {
  const digits = mobile.replace(/\D/g, "").slice(-10);
  return `https://wa.me/91${digits}`;
}

function capitalizeRisk(level: string) {
  if (!level) return level;
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}

export default function LungTestLeadsSection() {
  const { data, error, isLoading } = useSWR("/api/admin/phase1/leads", fetcher);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [page, setPage] = useState(1);

  const leads = data?.leads ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (
        riskFilter !== "all" &&
        l.risk_level.toLowerCase() !== riskFilter.toLowerCase()
      ) {
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

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

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
    toast.success("CSV downloaded", {
      duration: 3000,
      style: {
        background: "#324023",
        color: "#fff",
        borderRadius: "12px",
        fontWeight: 600,
      },
    });
  };

  const showingFrom = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(safePage * PAGE_SIZE, filtered.length);

  return (
    <div className="glass-card mb-6 overflow-hidden rounded-xl">
      <div className="flex flex-col gap-4 border-b border-[rgba(255,255,255,0.6)] bg-white/20 p-6 md:flex-row md:items-center md:justify-between">
        <h3 className="font-display text-2xl font-semibold text-[#324023]">
          Lung Test Leads
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Search name, email, mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className={cn(inputClass, "w-64")}
          />
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setPage(1);
            }}
            className={inputClass}
          >
            <option value="all">All Risk Levels</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className={cn(inputClass, "px-3")}
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className={cn(inputClass, "px-3")}
          />
          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-xl bg-[#324023] px-4 py-2 font-sans text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            ⬇ Download CSV
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="p-6 font-sans text-sm text-[#45483f]">Loading leads…</p>
      )}
      {error && (
        <p className="p-6 font-sans text-sm text-red-700">Could not load leads.</p>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.6)] bg-white/10 font-sans text-xs font-semibold uppercase tracking-wider text-[#45483f]">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Risk Level</th>
              <th className="p-4">City</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="font-sans text-sm">
            {pageRows.map((l) => (
              <tr
                key={l.id}
                className="border-b border-[rgba(255,255,255,0.6)] transition-colors hover:bg-white/30"
              >
                <td className="p-4 font-medium text-[#324023]">{l.name}</td>
                <td className="p-4 text-[#45483f]">{l.email}</td>
                <td className="p-4">
                  <a
                    href={waLink(l.mobile)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#25D366] hover:underline"
                  >
                    {l.mobile}
                  </a>
                </td>
                <td className="p-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      riskBadge(l.risk_level)
                    )}
                  >
                    {capitalizeRisk(l.risk_level)}
                  </span>
                </td>
                <td className="p-4 text-[#45483f]">{l.city || "—"}</td>
                <td className="p-4 text-xs text-[#45483f]">
                  {new Date(l.created_at).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
            {!isLoading && pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center font-sans text-sm text-[#45483f]"
                >
                  No leads match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.6)] bg-white/10 p-4">
        <span className="font-sans text-xs text-[#45483f]">
          Showing {showingFrom}–{showingTo} of {filtered.length}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-[rgba(255,255,255,0.6)] bg-white/30 px-3 py-1 font-sans text-sm text-[#324023] transition-colors hover:bg-white/50 disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            type="button"
            disabled={safePage * PAGE_SIZE >= filtered.length}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-[rgba(255,255,255,0.6)] bg-white/30 px-3 py-1 font-sans text-sm text-[#324023] transition-colors hover:bg-white/50 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
