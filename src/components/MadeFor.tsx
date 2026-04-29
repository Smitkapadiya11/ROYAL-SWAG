/**
 * MadeFor — "Three People Who Need This" in bold black-and-white cards.
 * Sits just before the final CTA section on the homepage.
 */
export default function MadeFor() {
  const cards = [
    {
      label: "Ex-Smokers",
      stat: "10 years",
      statSub: "tar stays after quitting",
      body:
        "Nicotine clears in 72 hours. Tar and particle deposits take up to a decade without targeted help. Quitting is the hard part — clearing what's left is what this is for.",
    },
    {
      label: "City Dwellers",
      stat: "9.78×",
      statSub: "India PM2.5 vs WHO limit",
      body:
        "Delhi recorded zero clean-air days in 2025. Mumbai, Surat, Bengaluru aren't far behind. Every commute, every window open — your lungs absorb what they were never built to handle.",
    },
    {
      label: "Wellness Buyers",
      stat: "Zero",
      statSub: "fillers or extracts",
      body:
        "You read labels. Good. Every ingredient here is listed with its Sanskrit name, its botanical name, and the precise reason it is in this formula. No filler herbs. No proprietary blends.",
    },
  ];

  return (
    <section style={{
      background: "#1A1A14",
      padding: "88px 0",
      borderTop: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div className="w">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{
            display: "block", fontSize: 11, fontWeight: 600,
            letterSpacing: 3, color: "rgba(196,154,42,0.7)", marginBottom: 12,
          }}>WHO IT&apos;S FOR</span>
          <h2 style={{ color: "#F2E6CE", maxWidth: 520, margin: "0 auto 0" }}>
            Made for three<br />
            <em style={{ fontStyle: "italic", color: "#C49A2A" }}>
              very specific people.
            </em>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          borderRadius: 14,
          overflow: "hidden",
        }} id="madefor-grid">
          {cards.map((c, i) => (
            <div key={c.label} style={{
              background: i === 1 ? "#F2E6CE" : "#fff",
              padding: "44px 36px",
            }}>
              {/* Big stat */}
              <div style={{
                fontFamily: "var(--ff-head)",
                fontSize: 48, fontWeight: 700,
                color: i === 1 ? "#2D3D15" : "#1A1A14",
                lineHeight: 1, marginBottom: 4,
              }}>{c.stat}</div>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 2,
                color: i === 1 ? "#4A6422" : "#999",
                marginBottom: 24,
              }}>{c.statSub.toUpperCase()}</p>

              {/* Label */}
              <h3 style={{
                fontSize: 20, fontWeight: 700,
                color: i === 1 ? "#2D3D15" : "#1A1A14",
                marginBottom: 14,
              }}>{c.label}</h3>

              <p style={{
                fontSize: 14, lineHeight: 1.8,
                color: i === 1 ? "#5C5647" : "#666",
              }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #madefor-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
