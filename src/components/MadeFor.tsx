import Link from "next/link";

export default function MadeFor() {
  const CARDS = [
    {
      id: "smoker",
      label: "If you smoke — or used to",
      title: "Your lungs remember every cigarette.\nEven the ones you stopped.",
      body:
        "Tar deposits don't leave on their own. They sit in lung tissue for up to 10 years after the last cigarette. You did the hard part. This is the follow-through.",
      cta: "See what tar does to lungs →",
      href: "/#herbs",
      gradient: "linear-gradient(160deg, #1A1A14 0%, #2C2C2C 50%, #1A1A14 100%)",
      accentColor: "#C49A2A",
      iconChar: "◈",
    },
    {
      id: "city",
      label: "If you live in a city",
      title: "India's air is 9.78×\nthe WHO safe limit.",
      body:
        "Delhi recorded zero clean-air days in 2025. You breathe it on your commute, at work, in traffic. Your lungs are filtering it all — right now.",
      cta: "Start your daily detox →",
      href: "/product",
      gradient: "linear-gradient(160deg, #111820 0%, #1C2830 50%, #111820 100%)",
      accentColor: "#C49A2A",
      iconChar: "◉",
    },
    {
      id: "wellness",
      label: "If you take health seriously",
      title: "You read labels.\nGood. We'll show you everything.",
      body:
        "Every herb has a Sanskrit name, a botanical name, and a clinical reason for being in this formula. No proprietary blends. Full transparency, because you earned it.",
      cta: "Read the full formula →",
      href: "/#herbs",
      gradient: "linear-gradient(160deg, #141A12 0%, #1E2A18 50%, #141A12 100%)",
      accentColor: "#8BC34A",
      iconChar: "◇",
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
            gap: 12,
            borderRadius: 18,
            overflow: "visible",
          }} id="madefor-grid">
            {CARDS.map((c) => (
              <div
                key={c.id}
                style={{
                  position: "relative",
                  minHeight: 520,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  overflow: "hidden",
                  background: c.gradient,
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                }} />

                <div style={{
                  position: "absolute",
                  top: 32,
                  right: 28,
                  fontSize: 80,
                  fontWeight: 300,
                  color: c.accentColor,
                  opacity: 0.07,
                  lineHeight: 1,
                  userSelect: "none",
                  fontFamily: "var(--ff-head, Georgia, serif)",
                }}>
                  {c.iconChar}
                </div>

                <div style={{
                  position: "relative",
                  zIndex: 2,
                  padding: "0 32px 40px",
                }}>
                  <p style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "3.5px",
                    color: c.accentColor,
                    marginBottom: 14,
                    textTransform: "uppercase",
                  }}>
                    {c.label}
                  </p>
                  <h3 style={{
                    fontFamily: "var(--ff-head, Georgia, serif)",
                    fontSize: "clamp(20px, 2vw, 26px)",
                    fontWeight: 600,
                    color: "#F2E6CE",
                    marginBottom: 16,
                    lineHeight: 1.25,
                    whiteSpace: "pre-line",
                    textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                  }}>
                    {c.title}
                  </h3>
                  <p style={{
                    fontSize: 14,
                    lineHeight: 1.8,
                    color: "rgba(242,230,206,0.72)",
                    marginBottom: 24,
                  }}>
                    {c.body}
                  </p>
                  <Link
                    href={c.href}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.3px",
                      color: c.accentColor,
                      textDecoration: "none",
                      borderBottom: `1px solid ${c.accentColor}45`,
                      paddingBottom: 2,
                    }}
                  >
                    {c.cta}
                  </Link>
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
