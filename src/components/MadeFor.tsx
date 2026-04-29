/**
 * MadeFor — "Three people who need this tea."
 * Each card has a background image filtered for tone, with black text + white glow overlay.
 */
export default function MadeFor() {
  const cards = [
    {
      label: "Ex-Smokers",
      stat: "10 years",
      statSub: "Tar stays after quitting",
      body:
        "Nicotine clears in 72 hours. The tar and particle deposits from smoking take up to a decade without targeted herbs. Quitting is the hard part — clearing what is left behind is what Royal Swag is for.",
      bg: "/images/product-7.jpg",
      filter: "grayscale(80%) brightness(0.55)",
      overlay: "rgba(0,0,0,0.28)",
    },
    {
      label: "City Dwellers",
      stat: "9.78×",
      statSub: "India PM2.5 vs WHO limit",
      body:
        "Delhi recorded zero clean-air days in 2025. Mumbai, Surat, Bengaluru aren't far behind. Every commute, every open window — your lungs absorb what they were never built to handle.",
      bg: "/images/product-8.jpg",
      filter: "grayscale(80%) brightness(0.55)",
      overlay: "rgba(0,0,0,0.28)",
    },
    {
      label: "Wellness Buyers",
      stat: "Zero",
      statSub: "Fillers or extracts",
      body:
        "You read labels. Good. Every ingredient here comes with its Sanskrit name, its botanical name, and the precise reason it is in this formula. No hidden blends. No proprietary noise.",
      bg: "/images/product-9.jpg",
      filter: "brightness(0.72) saturate(1.3)",
      overlay: "rgba(20,40,0,0.22)",
    },
  ];

  return (
    <>
      {/* ── Detox heading bridge ── */}
      <section style={{
        background: "#F2E6CE",
        padding: "80px 0 56px",
        textAlign: "center",
        borderTop: "1px solid rgba(212,200,168,0.4)",
      }}>
        <div className="w">
          <span className="ey">The Goal</span>
          <h2 style={{ color: "#2D3D15", maxWidth: 620, margin: "0 auto 16px" }}>
            Detox Lungs in<br />
            <em style={{ fontStyle: "italic", color: "#4A6422" }}>
              Healthy Side.
            </em>
          </h2>
          <div className="rl-c" />
          <p style={{
            fontSize: 17, color: "#5C5647",
            maxWidth: 480, margin: "0 auto 0", lineHeight: 1.8,
          }}>
            Two versions of your lungs exist. Which one you end up with depends entirely on
            what you do in the next 30 days.
          </p>
        </div>
      </section>

      {/* ── Made For cards ── */}
      <section style={{
        background: "#1A1A14",
        padding: "0 0 88px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div className="w">
          <div style={{ textAlign: "center", padding: "72px 0 48px" }}>
            <span style={{
              display: "block", fontSize: 11, fontWeight: 600,
              letterSpacing: 3, color: "rgba(196,154,42,0.7)", marginBottom: 12,
            }}>WHO IT&apos;S FOR</span>
            <h2 style={{ color: "#F2E6CE", maxWidth: 520, margin: "0 auto" }}>
              Made for three<br />
              <em style={{ fontStyle: "italic", color: "#C49A2A" }}>
                very specific people.
              </em>
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
            borderRadius: 18,
            overflow: "hidden",
          }} id="madefor-grid">
            {cards.map((c) => (
              <div
                key={c.label}
                style={{
                  position: "relative",
                  minHeight: 420,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                {/* Background image */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url(${c.bg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: c.filter,
                  zIndex: 0,
                }} />

                {/* Dark overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: c.overlay,
                  zIndex: 1,
                }} />

                {/* Content */}
                <div style={{
                  position: "relative", zIndex: 2,
                  padding: "36px 30px",
                }}>
                  {/* Big stat */}
                  <div style={{
                    fontFamily: "var(--ff-head)",
                    fontSize: 52, fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1, marginBottom: 4,
                    textShadow: "0 2px 12px rgba(255,255,255,0.18)",
                  }}>{c.stat}</div>
                  <p style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 2,
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: 20,
                    textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                  }}>{c.statSub.toUpperCase()}</p>

                  {/* Label */}
                  <h3 style={{
                    fontSize: 22, fontWeight: 700,
                    color: "#fff",
                    marginBottom: 14,
                    textShadow: "0 1px 8px rgba(0,0,0,0.6), 0 0 24px rgba(255,255,255,0.1)",
                  }}>{c.label}</h3>

                  <p style={{
                    fontSize: 14, lineHeight: 1.8,
                    color: "rgba(255,255,255,0.88)",
                    textShadow: "0 1px 6px rgba(0,0,0,0.7)",
                  }}>{c.body}</p>
                </div>
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
    </>
  );
}
