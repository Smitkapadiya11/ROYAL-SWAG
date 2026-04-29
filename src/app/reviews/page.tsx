import Link from "next/link";
import { S } from "@/lib/config";

export default function ReviewsPage() {
  return (
    <>
      {/* Header */}
      <section style={{
        background: "var(--deep)", color: "var(--cream)",
        padding: "clamp(80px,8vw,120px) var(--px) clamp(60px,6vw,80px)",
        textAlign: "center",
      }}>
        <div className="wrap">
          <span className="eyebrow" style={{ color: "rgba(196,154,42,0.7)" }}>
            Real Stories
          </span>
          <h1 style={{ color: "var(--cream)", marginBottom: 12 }}>
            People Like You.<br />
            <em style={{ color: "var(--gold)" }}>Specific Results.</em>
          </h1>
          <div className="rule rule-c" style={{ background: "var(--gold)" }} />
          <p style={{ color: "rgba(242,230,206,0.6)", fontSize: 15 }}>
            4.7 stars · 847+ verified Amazon reviews
          </p>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="wrap">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}>
            {S.reviews.map(r => (
              <div key={r.name} className="card" style={{ padding: "28px" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 20,
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "var(--olive)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--cream)", fontSize: 14, fontWeight: 600,
                    flexShrink: 0,
                  }}>{r.initials}</div>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: 2,
                    background: "var(--cream)", color: "var(--olive)",
                    border: "1px solid var(--olive)",
                    padding: "3px 10px", borderRadius: 4,
                  }}>WAS: {r.risk.toUpperCase()}</span>
                </div>
                <div style={{ color: "var(--gold)", fontSize: 15, marginBottom: 16, letterSpacing: 3 }}>
                  ★★★★★
                </div>
                <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
                  <strong style={{ color: "var(--muted)", fontWeight: 500 }}>Before: </strong>
                  {r.before}
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--olive)", fontWeight: 500 }}>
                  After: {r.after}
                </p>
                <p style={{
                  marginTop: 20, paddingTop: 16,
                  borderTop: "1px solid var(--border)",
                  fontSize: 12, fontWeight: 600,
                  color: "var(--muted)", letterSpacing: 0.3,
                }}>— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "var(--olive)", padding: "var(--py) var(--px)",
        textAlign: "center",
      }}>
        <div className="wrap">
          <h2 style={{ color: "var(--cream)", marginBottom: 12 }}>
            Join 847+ Customers<br />Breathing Easier.
          </h2>
          <div className="rule rule-c" style={{ background: "var(--gold)" }} />
          <p style={{ color: "rgba(242,230,206,0.7)", fontSize: 16, marginBottom: 32 }}>
            {S.price.now} · Free Delivery · 30-Day Guarantee · COD Available
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/product" className="btn btn-gold">
              Order Now — {S.price.now} →
            </Link>
            <Link href="/lung-test" className="btn btn-ghost-light">
              Take Free Lung Test
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
