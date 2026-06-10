"use client";

import { Fragment, useMemo, useState } from "react";
import useSWR from "swr";
import { csvDateFilename, downloadCsv } from "@/lib/admin/export-csv";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  risk_level: string;
  score: number;
  converted: boolean;
  created_at: string;
  answers?: Record<string, boolean>;
  matched_herbs?: string[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function waFollowUp(lead: Lead) {
  const digits = (lead.phone || "").replace(/\D/g, "").slice(-10);
  const msg = encodeURIComponent(
    `Hi ${lead.name.split(" ")[0]}, thanks for taking the Royal Swag Lung Test. Based on your ${lead.risk_level} risk profile, our Tar Out Tea can help. Shall I share details?`
  );
  return `https://wa.me/91${digits}?text=${msg}`;
}

export default function LeadsPage() {
  const [risk, setRisk] = useState("all");
  const [converted, setConverted] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading } = useSWR(
    `/api/dashboard/leads?risk=${risk}&converted=${converted}`,
    fetcher
  );

  const leads: Lead[] = data?.leads ?? [];

  const exportCsv = () => {
    downloadCsv(
      [
        ["Name", "Email", "Phone", "Risk", "Score", "Converted", "Date"],
        ...leads.map((l) => [
          l.name,
          l.email,
          l.phone,
          l.risk_level,
          String(l.score),
          l.converted ? "yes" : "no",
          l.created_at,
        ]),
      ],
      csvDateFilename("leads")
    );
  };

  const filtered = useMemo(() => leads, [leads]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select value={risk} onChange={(e) => setRisk(e.target.value)} className="dashboard-input w-auto">
          <option value="all">All risk levels</option>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
        <select
          value={converted}
          onChange={(e) => setConverted(e.target.value)}
          className="dashboard-input w-auto"
        >
          <option value="all">All conversion</option>
          <option value="true">Converted</option>
          <option value="false">Not converted</option>
        </select>
        <button type="button" className="dashboard-btn" onClick={exportCsv}>
          Export CSV
        </button>
      </div>

      <div className="dashboard-card overflow-x-auto p-4">
        {isLoading ? (
          <div className="dashboard-skeleton h-40" />
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#9CA3AF]">
            No lung test leads yet.
          </p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Risk</th>
                <th>Score</th>
                <th>Date</th>
                <th>Converted</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <Fragment key={l.id}>
                  <tr
                    className="cursor-pointer hover:bg-white/5"
                    onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                  >
                    <td>{l.name}</td>
                    <td>{l.email}</td>
                    <td>{l.phone}</td>
                    <td className="capitalize">{l.risk_level}</td>
                    <td>{l.score}</td>
                    <td>{new Date(l.created_at).toLocaleDateString("en-IN")}</td>
                    <td>{l.converted ? "✓" : "—"}</td>
                    <td>
                      <a
                        href={waFollowUp(l)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#10B981] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                  {expanded === l.id ? (
                    <tr>
                      <td colSpan={8} className="bg-black/20 text-xs text-[#9CA3AF]">
                        <p className="font-semibold text-[#F0F0F0]">Symptoms (YES)</p>
                        <p className="mt-1">
                          {Object.entries(l.answers ?? {})
                            .filter(([, v]) => v)
                            .map(([k]) => k)
                            .join(", ") || "None"}
                        </p>
                        <p className="mt-2 font-semibold text-[#F0F0F0]">Matched herbs</p>
                        <p className="mt-1">{(l.matched_herbs ?? []).join(", ") || "—"}</p>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
