import Link           from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed — Royal Swag",
};

// Next.js 15+ passes searchParams as a Promise — must be awaited
export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; order?: string }>;
}) {
  const { id: paymentId, order: orderId } = await searchParams;

  return (
    <main style={{
      minHeight:      "100svh",
      background:     "#F2E6CE",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      padding:        "80px 24px",
    }}>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>

        {/* Success icon */}
        <div style={{
          width:          80, height: 80,
          borderRadius:   "50%",
          background:     "#4A6422",
          color:          "#F2E6CE",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       36,
          margin:         "0 auto 28px",
          boxShadow:      "0 4px 24px rgba(74,100,34,0.25)",
        }}>✓</div>

        <h1 style={{
          fontFamily:   "var(--ff-head)",
          fontSize:     "clamp(28px, 4vw, 40px)",
          color:        "#2D3D15",
          marginBottom: 12,
          lineHeight:   1.2,
        }}>
          Your order is confirmed.
        </h1>

        <p style={{
          fontSize:     16,
          color:        "#5C5647",
          lineHeight:   1.75,
          maxWidth:     400,
          margin:       "0 auto 8px",
        }}>
          Your lungs are about to thank you.
          We will ship within 24 hours on weekdays.
        </p>

        <p style={{
          fontSize:     14,
          color:        "#5C5647",
          lineHeight:   1.6,
          marginBottom: 32,
        }}>
          A confirmation will be sent to your registered contact.
        </p>

        {/* Order details */}
        {(paymentId || orderId) && (
          <div style={{
            background:   "#fff",
            borderRadius: 10,
            border:       "1px solid #D4C8A8",
            padding:      "20px 24px",
            marginBottom: 32,
            textAlign:    "left",
          }}>
            <p style={{
              fontSize:      10,
              fontWeight:    700,
              letterSpacing: "2px",
              color:         "#C49A2A",
              marginBottom:  12,
            }}>ORDER DETAILS</p>

            {orderId && (
              <div style={{
                display:        "flex",
                justifyContent: "space-between",
                fontSize:       13,
                marginBottom:   8,
                gap:            12,
              }}>
                <span style={{ color: "#5C5647" }}>Order ID</span>
                <span style={{
                  color:      "#1A1A14",
                  fontFamily: "monospace",
                  fontSize:   12,
                  wordBreak:  "break-all",
                }}>{orderId}</span>
              </div>
            )}

            {paymentId && (
              <div style={{
                display:        "flex",
                justifyContent: "space-between",
                fontSize:       13,
                gap:            12,
              }}>
                <span style={{ color: "#5C5647" }}>Payment ID</span>
                <span style={{
                  color:      "#1A1A14",
                  fontFamily: "monospace",
                  fontSize:   12,
                  wordBreak:  "break-all",
                }}>{paymentId}</span>
              </div>
            )}
          </div>
        )}

        {/* Delivery promises */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 12,
          marginBottom:        36,
        }}>
          {[
            { icon: "📦", label: "Ships in 24hrs",   sub: "Weekdays" },
            { icon: "🚚", label: "Free Delivery",     sub: "Pan India" },
            { icon: "↩",  label: "30-Day Guarantee",  sub: "Full refund" },
          ].map(d => (
            <div key={d.label} style={{
              background:   "#fff",
              border:       "1px solid #D4C8A8",
              borderRadius: 8,
              padding:      "14px 8px",
              textAlign:    "center",
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{d.icon}</div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A14", marginBottom: 2 }}>
                {d.label}
              </p>
              <p style={{ fontSize: 11, color: "#5C5647" }}>{d.sub}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{
            background:   "#4A6422",
            color:        "#F2E6CE",
            padding:      "13px 28px",
            borderRadius: 6,
            fontWeight:   500,
            fontSize:     14,
          }}>Back to Home</Link>
          <Link href="/reviews" style={{
            background:   "transparent",
            color:        "#4A6422",
            padding:      "13px 28px",
            borderRadius: 6,
            fontWeight:   500,
            fontSize:     14,
            border:       "1.5px solid #4A6422",
          }}>Read Customer Results</Link>
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: "#5C5647", opacity: 0.65 }}>
          Questions? Write to{" "}
          <a href="mailto:Eximburg@gmail.com" style={{ color: "#4A6422" }}>
            Eximburg@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}
