"use client";

import Link from "next/link";

const REVIEWS = [
  {
    id: "r1",  initials: "SP", line: "Sneha Patil, 38, Mumbai",    tier: "High Risk",
    before: "I lived near a textile belt — stairs left me winded before 11 a.m.",
    after:  "After 4 weeks I climb three floors without pausing. Mornings feel normal again.",
  },
  {
    id: "r2",  initials: "AV", line: "Aditya Verma, 44, Delhi",    tier: "Moderate Risk",
    before: "Every winter I woke up with a rattling chest for hours — I thought it was just Delhi life.",
    after:  "Second year on Royal Swag; by week 2 the morning rattle was half what it used to be.",
  },
  {
    id: "r3",  initials: "KN", line: "Kavitha Nair, 41, Bengaluru", tier: "Mild Risk",
    before: "I assumed it was fancy chai — didn't expect anything measurable.",
    after:  "Six weeks in, my ENT noted clearer airway readings at follow-up. I'm a convert.",
  },
  {
    id: "r4",  initials: "VM", line: "Vikram Mehta, 49, Surat",    tier: "High Risk",
    before: "Quit smoking 2 years ago but chest heaviness never left — nothing else moved the needle.",
    after:  "Three weeks of Royal Swag and the weight in my chest finally eased.",
  },
  {
    id: "r5",  initials: "PS", line: "Pooja Sharma, 36, Ahmedabad", tier: "Moderate Risk",
    before: "My husband's mild asthma meant we feared trying anything new without doctor buy-in.",
    after:  "45 days in — fewer rescue inhaler days and more energy. His chest doctor said keep going.",
  },
  {
    id: "r6",  initials: "RK", line: "Rajesh Kumar, 52, Kanpur",   tier: "Mild Risk",
    before: "Kanpur air + sinus pressure wore me down daily; I expected another gimmick.",
    after:  "Symptoms didn't vanish but they're manageable now — and I actually like the taste.",
  },
  {
    id: "r7",  initials: "AS", line: "Anita Singh, 35, Lucknow",   tier: "High Risk",
    before: "My father's spirometry was flat for a year — we'd tried everything else.",
    after:  "Two months of morning tea later, numbers improved. Doctor asked what changed.",
  },
  {
    id: "r8",  initials: "SR", line: "Suresh Rao, 47, Chennai",    tier: "Moderate Risk",
    before: "Humidity + paint fumes from work left my chest tight every evening.",
    after:  "Morning + evening cups — I walk off the job site breathing easier than I have in years.",
  },
  {
    id: "r9",  initials: "PJ", line: "Priya Joshi, 33, Pune",      tier: "Mild Risk",
    before: "March and October allergies owned my calendar — I dreaded the season flip.",
    after:  "I start Royal Swag three weeks early now; the transition barely registers.",
  },
  {
    id: "r10", initials: "DG", line: "Deepak Gupta, 51, Jaipur",   tier: "High Risk",
    before: "Fifteen years around diesel — talking full sentences without coughing felt impossible.",
    after:  "Three months in, people comment on how I sound on calls. Breathing feels deeper.",
  },
];

export default function ReviewsPage() {
  return (
    <div style={{ background: "var(--rs-cream)", minHeight: "100vh" }}>
      {/* Header */}
      <section style={{ background: "var(--rs-deep)", padding: "64px var(--section-px) 48px", textAlign: "center" }}>
        <span className="eyebrow" style={{ color: "rgba(196,154,42,0.8)" }}>Verified Reviews</span>
        <h1 style={{ color: "var(--rs-cream)", marginBottom: 12 }}>
          What Our Customers Say
        </h1>
        <div className="divider divider--center" style={{ background: "var(--rs-gold)" }} />
        <p style={{ color: "rgba(242,230,206,0.65)", fontSize: 15, marginBottom: 0 }}>
          847+ verified reviews · real buyers · real breathing results
        </p>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap", marginTop: 32 }}>
          {[
            { value: "4.7★", label: "Amazon Rating" },
            { value: "847+", label: "Verified Reviews" },
            { value: "10",   label: "Cities Across India" },
            { value: "30",   label: "Day Guarantee" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 700, color: "var(--rs-gold)" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "rgba(242,230,206,0.5)", letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews grid */}
      <section className="section section--white">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}>
            {REVIEWS.map(({ id, initials, line, tier, before, after }) => (
              <article key={id} className="card" style={{ padding: "28px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: "var(--rs-olive)", color: "var(--rs-gold)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 13, flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: "var(--rs-dark)", margin: 0 }}>{line}</p>
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
                    background: "rgba(196,154,42,0.1)", color: "var(--rs-gold)",
                    padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(196,154,42,0.2)",
                    flexShrink: 0, whiteSpace: "nowrap",
                  }}>
                    {tier}
                  </span>
                </div>
                <div style={{ color: "var(--rs-gold)", fontSize: 16, marginBottom: 14, letterSpacing: 2 }}>
                  ★★★★★
                </div>
                <p style={{ fontSize: 14, color: "var(--rs-text)", lineHeight: 1.7, marginBottom: 10 }}>
                  <strong style={{ color: "var(--rs-dark)" }}>Before:</strong> {before}
                </p>
                <p style={{ fontSize: 14, color: "var(--rs-dark)", lineHeight: 1.7, marginBottom: 14 }}>
                  <strong style={{ color: "var(--rs-olive)" }}>After:</strong> {after}
                </p>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                  color: "var(--rs-olive)", background: "rgba(74,100,34,0.08)",
                  padding: "4px 10px", borderRadius: 20,
                }}>
                  ✓ Verified Buyer
                </span>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/product" className="btn-primary">
              Order Now — ₹349 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
