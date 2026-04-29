import Link from "next/link";
import { S } from "@/lib/config";

export default function ReviewsPage() {
  return (
    <>
      {/* Header */}
      <section style={{
        background: "#2D3D15", color: "#F2E6CE",
        padding: "clamp(80px,8vw,120px) 0 clamp(60px,6vw,80px)",
        textAlign: "center",
      }}>
        <div className="w">
          <span className="ey" style={{ color: "rgba(196,154,42,0.7)" }}>Real Stories</span>
          <h1 style={{ color: "#F2E6CE", marginBottom: 12 }}>
            People Like You.<br />
            <em style={{ color: "#C49A2A" }}>Specific Results.</em>
          </h1>
          <div className="rl-c" style={{ background: "#C49A2A" }} />
          <p style={{ color: "rgba(242,230,206,0.6)", fontSize: 15 }}>
            4.7 stars · 847+ verified Amazon reviews
          </p>
        </div>
      </section>

      {/* Reviews grid */}
      <section style={{ background: "transparent", padding: "80px 0" }}>
        <div className="w">
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
                    background: "#4A6422",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#F2E6CE", fontSize: 14, fontWeight: 600, flexShrink: 0,
                  }}>{r.initials}</div>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: 2,
                    background: "#F2E6CE", color: "#4A6422",
                    border: "1px solid #4A6422",
                    padding: "3px 10px", borderRadius: 4,
                  }}>WAS: {r.risk.toUpperCase()}</span>
                </div>
                <div style={{ color: "#C49A2A", fontSize: 15, marginBottom: 16, letterSpacing: 3 }}>
                  ★★★★★
                </div>
                <p style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
                  <strong style={{ color: "#5C5647", fontWeight: 500 }}>Before: </strong>
                  {r.before}
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#4A6422", fontWeight: 500 }}>
                  After: {r.after}
                </p>
                <p style={{
                  marginTop: 20, paddingTop: 16,
                  borderTop: "1px solid rgba(212,200,168,0.6)",
                  fontSize: 12, fontWeight: 600, color: "#5C5647",
                }}>— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#4A6422", padding: "80px 0", textAlign: "center" }}>
        <div className="w">
          <h2 style={{ color: "#F2E6CE", marginBottom: 12 }}>
            Join 847+ Customers<br />Breathing Easier.
          </h2>
          <div className="rl-c" style={{ background: "#C49A2A" }} />
          <p style={{ color: "rgba(242,230,206,0.7)", fontSize: 16, marginBottom: 32 }}>
            {S.price.now} · Free Delivery · 30-Day Guarantee · COD Available
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/product" className="b b-gold">
              Order Now — {S.price.now} →
            </Link>
            <Link href="/lung-test" className="b b-ghost-w">
              Take Free Lung Test
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
