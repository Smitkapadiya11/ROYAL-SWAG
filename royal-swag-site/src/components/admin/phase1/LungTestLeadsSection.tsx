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

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  const json = (await r.json().catch(() => ({}))) as {
    leads?: Lead[];
    error?: string;
  };
  if (!r.ok) {
    throw new Error(json.error || "Failed to load leads");
  }
  return { leads: json.leads ?? [] };
};

const inputClass =
  "h-9 rounded-xl border border-[#324023]/20 bg-[#F4EDD6] px-4 font-sans text-sm text-[#171e11] placeholder:text-[#75786e] transition-all focus:border-[#9A6F1A] focus:outline-none focus:ring-2 focus:ring-[#9A6F1A]/15";

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
  const leadsError = error instanceof Error ? error.message : null;

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

  return (
    <div
      className="mb-6 overflow-hidden rounded-2xl border border-[rgba(200,210,190,0.5)] bg-white/50"
      style={{ backdropFilter: "blur(12px)" }}
    >
      <div className="flex flex-col gap-4 border-b border-[rgba(200,210,190,0.4)] bg-white/30 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="shrink-0 font-display text-xl font-bold text-[#324023]">
          Lung Test Leads
        </h2>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
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
            className={cn(inputClass, "cursor-pointer px-3")}
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
          <span className="font-sans text-xs text-[#75786e]">to</span>
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
            className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-[#324023] px-4 font-sans text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            ↓ CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[rgba(200,210,190,0.4)] bg-[#e9f1dc]/60">
              {["Name", "Email", "Mobile", "Risk Level", "City", "Date"].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-[#45483f]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center font-sans text-sm text-[#75786e]">
                  Loading leads\u2026
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center font-sans text-sm text-[#75786e]">
                  {leadsError ? (
                    <span className="text-red-500">
                      \u26A0 {leadsError} \u2014 check Supabase connection
                    </span>
                  ) : (
                    "No leads yet. They appear here after customers complete the Lung Test."
                  )}
                </td>
              </tr>
            ) : (
              pageRows.map((l, i) => (
                <tr
                  key={l.id}
                  className={cn(
                    "border-b border-[rgba(200,210,190,0.3)] transition-colors hover:bg-[#9A6F1A]/5",
                    i % 2 === 0 ? "bg-white/20" : "bg-transparent"
                  )}
                >
                  <td className="px-5 py-3.5 font-sans text-sm font-semibold text-[#324023]">
                    {l.name}
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm text-[#45483f]">
                    {l.email || "\u2014"}
                  </td>
                  <td className="px-5 py-3.5">
                    <a
                      href={waLink(l.mobile)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm font-medium text-[#25D366] hover:underline"
                    >
                      {l.mobile}
                    </a>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 font-sans text-xs font-semibold",
                        riskBadge(l.risk_level)
                      )}
                    >
                      {capitalizeRisk(l.risk_level) || "Mild"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm text-[#45483f]">
                    {l.city || "\u2014"}
                  </td>
                  <td className="px-5 py-3.5 font-sans text-xs text-[#75786e]">
                    {new Date(l.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[rgba(200,210,190,0.4)] bg-white/20 px-6 py-3">
        <span className="font-sans text-xs text-[#45483f]">
          {filtered.length} total leads
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-8 rounded-lg border border-[rgba(200,210,190,0.6)] px-3 font-sans text-xs text-[#324023] transition-colors hover:bg-white/50 disabled:opacity-30"
          >
            ← Prev
          </button>
          <span className="px-2 font-sans text-xs text-[#45483f]">
            Page {safePage} of {pageCount}
          </span>
          <button
            type="button"
            disabled={safePage * PAGE_SIZE >= filtered.length}
            onClick={() => setPage((p) => p + 1)}
            className="h-8 rounded-lg border border-[rgba(200,210,190,0.6)] px-3 font-sans text-xs text-[#324023] transition-colors hover:bg-white/50 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
