"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { S } from "@/lib/config";
import RazorpayButton from "@/components/RazorpayButton";
import CheckoutModal from "@/components/CheckoutModal";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";
import LeadGuardExternalLink from "@/components/LeadGuardExternalLink";
import { useLeadCapture } from "@/hooks/useLeadCapture";
import { parseStoredLead } from "@/lib/lead-capture-storage";
import { RS_ORDER_CONFIRMATION_KEY } from "@/lib/order-confirmation-storage";
import { trackOrderLead } from "@/lib/trackLead";

const PACKS = [
  { id: "20", bags: "20 Bags", days: "30-Day Supply", price: 349, mrp: 499, tag: "" },
  { id: "40", bags: "40 Bags", days: "60-Day Supply", price: 649, mrp: 899, tag: "Most Popular" },
  { id: "60", bags: "60 Bags", days: "90-Day Supply", price: 899, mrp: 1299, tag: "Best Value" },
];

const PRODUCT_IMAGES = [
  "/images/product-2.jpg",
  "/images/product-1.jpg",
  "/images/product-3.jpg",
  "/images/product-4.jpg",
  "/images/product-10.jpg",
  "/images/product-11.jpg",
];

export default function ProductPage() {
  const { openLeadModal } = useLeadCapture();
  const [pack, setPack] = useState(PACKS[0]);
  const [time, setTime] = useState("--:--:--");
  const [activeImage, setActiveImage] = useState(0);

  // ── 2-HOUR COUPON DEADLINE ────────────────────────────────────
  const [couponDisplay, setCouponDisplay] = useState("02:00:00");
  const [couponDead,    setCouponDead]    = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [couponMsgType, setCouponMsgType] = useState<"success" | "error" | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState({
    name: "",
    mobile: "",
    package: "",
    amount: 0,
    orderId: "",
    paymentId: "",
  });
  const couponIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    const KEY = "rs_offer_end";
    let end = parseInt(localStorage.getItem(KEY) || "0");
    if (!end || end < Date.now()) {
      end = Date.now() + 48 * 3600 * 1000;
      localStorage.setItem(KEY, String(end));
    }
    const tick = () => {
      const d = Math.max(0, end - Date.now());
      const h = String(Math.floor(d / 3600000)).padStart(2, "0");
      const m = String(Math.floor((d % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((d % 60000) / 1000)).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const KEY = "rs_coupon_end";
    const TWO_HRS = 2 * 60 * 60 * 1000;
    let end = parseInt(localStorage.getItem(KEY) || "0");
    if (!end || end < Date.now()) {
      end = Date.now() + TWO_HRS;
      localStorage.setItem(KEY, String(end));
    }
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      if (diff === 0) {
        setCouponDead(true);
        setCouponDisplay("00:00:00");
        setAppliedCoupon(null);
        setCouponMsgType("error");
        setCouponMsg("Coupon window expired. It resets every 2 hours.");
        const id = couponIntervalRef.current;
        if (id !== undefined) clearInterval(id);
        return;
      }
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setCouponDisplay(`${h}:${m}:${s}`);
    };
    tick();
    couponIntervalRef.current = setInterval(tick, 1000);
    return () => {
      const id = couponIntervalRef.current;
      if (id !== undefined) clearInterval(id);
      couponIntervalRef.current = undefined;
    };
  }, []);

  const isCouponApplied = appliedCoupon === "LUNG25";
  const discountAmount = isCouponApplied ? Math.round(pack.price * 0.25) : 0;
  const payableAmount = pack.price - discountAmount;

  const applyCoupon = (rawCode: string) => {
    const normalized = rawCode.trim().toLowerCase();

    if (couponDead) {
      setCouponMsgType("error");
      setCouponMsg("Coupon window expired. It resets every 2 hours.");
      setAppliedCoupon(null);
      return;
    }

    if (normalized === "lung25") {
      setAppliedCoupon("LUNG25");
      setCouponMsgType("success");
      setCouponMsg("Coupon applied — 25% off this order.");
      return;
    }

    if (normalized.length > 0) {
      setAppliedCoupon(null);
      setCouponMsgType("error");
      setCouponMsg("Invalid coupon code.");
    } else {
      setAppliedCoupon(null);
      setCouponMsgType(null);
      setCouponMsg(null);
    }
  };

  return (
    <>
      {/* ── PRODUCT HERO ── */}
      <section className="product-hero-section" style={{ background: "transparent", padding: "clamp(40px,6vw,80px) 0" }}>
        <div className="w">
          <div id="product-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px, 6vw, 80px)",
            alignItems: "flex-start",
          }}>
            {/* ── Image gallery panel ── */}
            <div className="product-gallery-card" style={{
              position: "sticky", top: 88,
              background: "#fff",
              borderRadius: 16, border: "1px solid rgba(212,200,168,0.85)",
              padding: 24,
              display: "flex", flexDirection: "column", gap: 14,
              boxShadow: "0 12px 40px rgba(45, 61, 21, 0.06)",
            }}>
              {/* Main image — desktop square; mobile capped height (premium proportion) */}
              <div className="product-hero-stage" style={{
                aspectRatio: "1", position: "relative",
                background: "linear-gradient(180deg, #FAF6EE 0%, #F2E6CE 100%)",
                borderRadius: 12, overflow: "hidden",
              }}>
                <Image
                  src={PRODUCT_IMAGES[activeImage] ?? PRODUCT_IMAGES[0]}
                  alt="Royal Swag Lung Detox Tea"
                  fill
                  priority
                  sizes="(max-width: 768px) 85vw, 480px"
                  style={{ objectFit: "contain", padding: "clamp(8px, 2vw, 16px)" }}
                />
              </div>
              {/* Thumbnails */}
              {PRODUCT_IMAGES.length > 1 && (
                <div className="product-thumb-row" style={{ display: "flex", gap: 8 }}>
                  {PRODUCT_IMAGES.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className="product-thumb-btn"
                      style={{
                        flex: 1, aspectRatio: "1",
                        position: "relative",
                        background: "#F5EFE4",
                        border: activeImage === i ? "2px solid #4A6422" : "1px solid #D4C8A8",
                        borderRadius: 8, padding: 6,
                        cursor: "pointer", overflow: "hidden",
                        minWidth: 0,
                      }}
                    >
                      <Image
                        src={src}
                        alt={`Product view ${i + 1}`}
                        fill
                        sizes="72px"
                        style={{ objectFit: "contain", padding: 4 }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info panel ── */}
            <div>
              {/* Cert badges */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {S.certs.map(c => (
                  <span key={c} style={{
                    fontSize: 10, fontWeight: 600,
                    border: "1px solid #4A6422",
                    color: "#4A6422", borderRadius: 4, padding: "3px 9px",
                  }}>{c}</span>
                ))}
              </div>

              <span className="ey">Tar Out · Lung Detox Tea</span>
              <h1 style={{ fontSize: "clamp(26px, 3vw, 36px)", marginBottom: 4 }}>
                Royal Swag Lung Detox Tea
              </h1>
              <p style={{ fontSize: 14, color: "#5C5647", marginBottom: 20, lineHeight: 1.67 }}>
                Seven whole herbs — Tulsi, Vasaka, Mulethi, Pippali, and three more — nothing powdered from a lab shelf.
                Inspired by Charaka Samhita notes, blended for how Indians actually breathe today.
              </p>

              {/* Countdown */}
              <div style={{
                background: "#2D3D15", borderRadius: 6,
                padding: "12px 16px", marginBottom: 24,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 12, color: "rgba(242,230,206,0.6)", flexShrink: 0 }}>
                  Offer ends in
                </span>
                <span style={{
                  fontFamily: "var(--ff-head)", fontSize: 20, fontWeight: 600,
                  color: "#C49A2A", fontVariantNumeric: "tabular-nums",
                }}>{time}</span>
              </div>

              {/* Pack selector */}
              <p style={{
                fontSize: 11, fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#5C5647", marginBottom: 12,
              }}>SELECT PACK</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {PACKS.map(p => (
                  <button key={p.id} onClick={() => setPack(p)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px 20px", borderRadius: 6,
                      border: `2px solid ${pack.id === p.id ? "#4A6422" : "rgba(212,200,168,0.6)"}`,
                      background: pack.id === p.id ? "rgba(74,100,34,0.04)" : "#fff",
                      cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        border: `2px solid ${pack.id === p.id ? "#4A6422" : "#D4C8A8"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {pack.id === p.id && (
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4A6422" }} />
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: "#1A1A14", margin: 0 }}>{p.bags}</p>
                        <p style={{ fontSize: 12, color: "#5C5647", margin: 0 }}>{p.days}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        fontFamily: "var(--ff-head)", fontSize: 18,
                        fontWeight: 600, color: "#4A6422",
                      }}>₹{p.price}</span>
                      <span style={{
                        fontSize: 12, color: "#D4C8A8",
                        textDecoration: "line-through", marginLeft: 6,
                      }}>₹{p.mrp}</span>
                      {p.tag && (
                        <div style={{
                          fontSize: 9, fontWeight: 600,
                          background: "#C49A2A", color: "#2D3D15",
                          borderRadius: 3, padding: "2px 6px", marginTop: 3,
                        }}>{p.tag.toUpperCase()}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* ══ COUPON SECTION ══════════════════════════════════ */}
              <div style={{
                borderRadius: 10,
                border: couponDead
                  ? "1px solid rgba(212,200,168,0.6)"
                  : "1.5px solid rgba(196,154,42,0.45)",
                background: couponDead
                  ? "rgba(212,200,168,0.12)"
                  : "linear-gradient(135deg,rgba(196,154,42,0.07),rgba(74,100,34,0.07))",
                padding: "18px 20px",
                marginBottom: 16,
              }}>
                {couponDead ? (
                  <p style={{ fontSize: 13, color: "#aaa", textAlign: "center" }}>
                    This offer has expired. It resets every 2 hours.
                  </p>
                ) : (
                  <>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: 12,
                      flexWrap: "wrap" as const, gap: 10,
                    }}>
                      <div>
                        <p style={{
                          fontSize: 10, fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: "#C49A2A", marginBottom: 3,
                        }}>⚡ SPECIAL OFFER — 25% OFF</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A14" }}>
                          Apply at checkout for an extra 25% off
                        </p>
                      </div>
                      <div style={{
                        background: "#2D3D15", borderRadius: 8,
                        padding: "8px 16px",
                        fontFamily: "var(--ff-head)",
                        fontSize: 22, fontWeight: 700,
                        color: "#C49A2A",
                        fontVariantNumeric: "tabular-nums",
                      }}>
                        {couponDisplay}
                      </div>
                    </div>

                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      background: "#fff",
                      border: "1.5px dashed rgba(196,154,42,0.6)",
                      borderRadius: 8, padding: "10px",
                    }}>
                      <input
                        value={couponInput}
                        onChange={(e) => {
                          const next = e.target.value.toUpperCase();
                          setCouponInput(next);
                          applyCoupon(next);
                        }}
                        placeholder="Enter coupon code"
                        aria-label="Coupon code"
                        style={{
                          flex: 1,
                          border: "1px solid rgba(212,200,168,0.9)",
                          borderRadius: 6,
                          padding: "10px 12px",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#2D3D15",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() => {
                          applyCoupon(couponInput);
                        }}
                        style={{
                          background: "#4A6422", color: "#F2E6CE",
                          border: "none", borderRadius: 6,
                          padding: "7px 16px", fontSize: 12,
                          fontWeight: 600, cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                      >
                        Apply
                      </button>
                    </div>

                    {couponMsg && (
                      <p
                        role="status"
                        style={{
                          marginTop: 10,
                          fontSize: 12,
                          fontWeight: 600,
                          color: couponMsgType === "success" ? "#2D7A4A" : "#9A2A2A",
                        }}
                      >
                        {couponMsg}
                      </p>
                    )}

                    <p style={{
                      fontSize: 11, color: "#5C5647",
                      marginTop: 8, opacity: 0.75, lineHeight: 1.5,
                    }}>
                      Offer expires in {couponDisplay}. Coupon resets every 2 hours.
                      Use at checkout — valid once per order.
                    </p>
                  </>
                )}
              </div>

              {/* Order Now — Razorpay */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                gap: 12,
                flexWrap: "wrap" as const,
              }}>
                <p style={{ fontSize: 13, color: "#5C5647" }}>
                  Payable now:
                  <strong style={{ color: "#2D3D15", marginLeft: 6 }}>
                    ₹{payableAmount}
                  </strong>
                </p>
                {isCouponApplied && (
                  <p style={{ fontSize: 12, color: "#2D7A4A", fontWeight: 600 }}>
                    LUNG25 saved ₹{discountAmount}
                  </p>
                )}
              </div>
              <div>
                <button
                  onClick={() => openLeadModal(() => setModalOpen(true))}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "#4A6422",
                    color: "#F2E6CE",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    marginBottom: 10,
                    transition: "background 0.18s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#2D3D15")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#4A6422")}
                >
                  Order Now — ₹{payableAmount} →
                </button>

                <LeadGuardExternalLink
                  href={`https://wa.me/917096553300?text=${encodeURIComponent(
                    `Hi, I want to order Royal Swag Lung Detox Tea — ${pack.bags}. Please confirm.`
                  )}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    padding: "13px 16px",
                    background: "rgba(37,211,102,0.07)",
                    border: "1px solid rgba(37,211,102,0.22)",
                    borderRadius: 8,
                    color: "#1A7A3A",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Order via WhatsApp instead
                </LeadGuardExternalLink>
              </div>

              <CheckoutModal
                isOpen={modalOpen}
                pack={pack}
                couponCode={appliedCoupon}
                discountedAmount={payableAmount}
                onClose={() => setModalOpen(false)}
                onConfirm={() => {
                  setModalOpen(false);
                  setPendingPayment(true);
                }}
              />

              {pendingPayment && (
                <div style={{ display: "none" }}>
                  <RazorpayButton
                    amount={payableAmount}
                    packLabel={`${pack.bags} — ${pack.days}`}
                    label="Pay Now"
                    fullWidth
                    autoTrigger
                    successRedirect={false}
                    onSuccess={(paymentId, razorpayOrderId, amountPaise) => {
                      void (async () => {
                        setPendingPayment(false);

                        const paidRupees =
                          typeof amountPaise === "number" &&
                          Number.isFinite(amountPaise) &&
                          amountPaise > 0
                            ? Math.round(amountPaise) / 100
                            : payableAmount;

                        const lead = parseStoredLead();
                        let raw: Record<string, string> = {};
                        try {
                          const s = localStorage.getItem("rs_lead");
                          if (s) raw = JSON.parse(s) as Record<string, string>;
                        } catch {
                          /* ignore */
                        }

                        const name =
                          lead?.name ||
                          (typeof raw.name === "string" ? raw.name : "") ||
                          "Customer";
                        const mobile =
                          lead?.mobile ||
                          (typeof raw.mobile === "string" ? raw.mobile : "") ||
                          (typeof raw.phone === "string" ? raw.phone : "");
                        const email =
                          lead?.email ||
                          (typeof raw.email === "string" ? raw.email : "");
                        const pkgLabel = `${pack.bags} — ${pack.days}`;

                        let dbOrderId = "";
                        if (mobile && email && name && paymentId) {
                          const orderResult = await trackOrderLead({
                            name,
                            mobile,
                            email,
                            address:
                              lead?.address ||
                              (typeof raw.address === "string"
                                ? raw.address
                                : ""),
                            city:
                              lead?.city ||
                              (typeof raw.city === "string" ? raw.city : ""),
                            pincode:
                              lead?.pincode ||
                              (typeof raw.pincode === "string"
                                ? raw.pincode
                                : ""),
                            state:
                              lead?.state ||
                              (typeof raw.state === "string" ? raw.state : ""),
                            amount: paidRupees,
                            package: pkgLabel,
                            payment_id: paymentId,
                          });
                          dbOrderId =
                            typeof orderResult?.orderId === "string"
                              ? orderResult.orderId
                              : "";
                        }

                        const snapshot = {
                          name,
                          mobile,
                          package: pkgLabel,
                          amount: paidRupees,
                          orderId: dbOrderId || razorpayOrderId || "",
                          paymentId: paymentId ?? "",
                        };

                        try {
                          sessionStorage.setItem(
                            RS_ORDER_CONFIRMATION_KEY,
                            JSON.stringify(snapshot)
                          );
                        } catch {
                          /* ignore */
                        }

                        setConfirmedOrder(snapshot);
                        setShowConfirmation(true);
                      })();
                    }}
                  />
                </div>
              )}

              {/* Guarantee pills */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12, marginTop: 20,
              }}>
                {[
                  { label: "Free Delivery",    sub: "Pan India" },
                  { label: "30-Day Guarantee", sub: "Full refund" },
                  { label: "Ships in 24hrs",   sub: "Weekdays" },
                ].map(g => (
                  <div key={g.label} style={{
                    textAlign: "center", padding: "14px 8px",
                    background: "#fff", borderRadius: 6,
                    border: "1px solid rgba(212,200,168,0.6)",
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#4A6422", marginBottom: 2 }}>
                      {g.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#5C5647" }}>{g.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .product-hero-section {
              padding-top: 12px !important;
              padding-bottom: 28px !important;
            }
            #product-grid {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
            #product-grid > div:first-child {
              position: static !important;
            }
            .product-gallery-card {
              padding: 12px !important;
              gap: 10px !important;
              border-radius: 14px !important;
              box-shadow: 0 8px 28px rgba(45, 61, 21, 0.07) !important;
            }
            .product-hero-stage {
              aspect-ratio: unset !important;
              width: 100% !important;
              max-width: 300px !important;
              height: min(42svh, 280px) !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }
            .product-thumb-row {
              gap: 6px !important;
              overflow-x: auto !important;
              padding-bottom: 4px !important;
              -webkit-overflow-scrolling: touch !important;
            }
            .product-thumb-btn {
              flex: 0 0 52px !important;
              width: 52px !important;
              height: 52px !important;
              aspect-ratio: 1 !important;
            }
          }
        `}</style>
      </section>

      <OrderConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        orderDetails={confirmedOrder}
      />

      {/* ══ HOW TO USE ══════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", borderTop: "1px solid rgba(212,200,168,0.4)" }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="ey">Instructions</span>
            <h2>
              Two cups a day.<br />
              <em style={{ fontStyle: "italic", color: "#4A6422" }}>
                That is genuinely all it takes.
              </em>
            </h2>
            <div className="rl-c" />
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2, background: "#D4C8A8",
            borderRadius: 14, overflow: "hidden",
          }} id="how-to-grid">
            {[
              {
                n: "01", title: "Brew it properly",
                desc: "Boil water to 90–95°C. Drop one bag in. Steep for 5 minutes — no less, no rushing. Skip the milk. A squeeze of lemon or a half-teaspoon of honey works fine.",
              },
              {
                n: "02", title: "Drink it twice",
                desc: "Morning, on an empty stomach before breakfast. Evening, 30 minutes before bed. Consistency beats intensity — show up daily.",
              },
              {
                n: "03", title: "Give it the time",
                desc: "Most people feel something by Day 7. A full detox cycle runs 30 days. For ex-smokers or heavy exposure — plan for 60 to 90 days.",
              },
            ].map(s => (
              <div key={s.n} style={{ background: "#fff", padding: "44px 32px" }}>
                <div className="brand-number-lg" style={{ marginBottom: 20 }}>{s.n}</div>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#5C5647", lineHeight: 1.8 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 768px) { #how-to-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ══ TIME EFFECT TIMELINE ════════════════════════════════════ */}
      <section style={{ background: "#2D3D15", padding: "80px 0" }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="ey" style={{ color: "rgba(196,154,42,0.7)" }}>What actually changes</span>
            <h2 style={{ color: "#F2E6CE" }}>
              The effects are real.<br />
              <em style={{ fontStyle: "italic", color: "#C49A2A" }}>Here is the timeline.</em>
            </h2>
            <div className="rl-c" style={{ background: "#C49A2A" }} />
          </div>

          {/* 90-day badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 20,
            background: "rgba(196,154,42,0.1)",
            border: "1px solid rgba(196,154,42,0.28)",
            borderRadius: 12, padding: "20px 28px", marginBottom: 48,
            flexWrap: "wrap" as const,
          }}>
            <div style={{
              fontFamily: "var(--ff-head)", fontSize: 56, fontWeight: 700,
              color: "#C49A2A", lineHeight: 1, flexShrink: 0,
            }}>90</div>
            <div>
              <p style={{ color: "#F2E6CE", fontWeight: 600, fontSize: 17, marginBottom: 4 }}>
                Days — the full deep restoration cycle
              </p>
              <p style={{ color: "rgba(242,230,206,0.6)", fontSize: 14 }}>
                Recommended for ex-smokers, high-pollution exposure, and chronic symptoms.
                Most people start feeling it around Day 7. Real restoration takes longer.
              </p>
            </div>
          </div>

          {/* Timeline rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2, borderRadius: 12, overflow: "hidden" }}>
            {[
              { day: "Day 3–5",   color: "#C49A2A", title: "First signals",
                desc: "Morning throat feels less sticky. Waking up without the automatic urge to clear your chest. Small — but you will notice." },
              { day: "Day 7–10",  color: "#6B9B5A", title: "Breathing starts to open",
                desc: "Stairs, walking fast, the commute — you are doing these without your chest feeling tight. Most customers send us a message around here." },
              { day: "Day 14–21", color: "#4A6422", title: "Active clearing",
                desc: "The body is actively moving accumulated buildup. Some experience temporary increase in expectoration — this is the detox working, not a side effect." },
              { day: "Day 30",    color: "#3A7A4A", title: "First cycle complete",
                desc: "Airways noticeably clearer. Energy levels improved. For most people, a second month locks in the results permanently." },
              { day: "Day 60–90", color: "#2A6A3A", title: "Deep tissue restoration",
                desc: "Where the real work happens for ex-smokers. Tar deposits break down at this depth. The Charaka Samhita formulation was designed for exactly this." },
            ].map(t => (
              <div key={t.day} style={{
                display: "flex", gap: 24, alignItems: "flex-start",
                background: "rgba(255,255,255,0.03)",
                padding: "22px 28px",
                borderLeft: `4px solid ${t.color}`,
              }}>
                <div style={{ minWidth: 88, flexShrink: 0 }}>
                  <span style={{
                    fontFamily: "var(--ff-head)", fontSize: 14,
                    fontWeight: 600, color: t.color,
                  }}>{t.day}</span>
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, color: "#F2E6CE", marginBottom: 5 }}>
                    {t.title}
                  </p>
                  <p style={{ fontSize: 14, color: "rgba(242,230,206,0.62)", lineHeight: 1.75 }}>
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HERB STRIP ── */}
      <section style={{ background: "transparent", padding: "80px 0", borderTop: "1px solid rgba(212,200,168,0.5)" }}>
        <div className="w">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="ey">What&apos;s Inside</span>
            <h2>The 7-Herb Formula</h2>
            <div className="rl-c" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {S.herbs.map(h => (
              <div key={h.id} style={{
                display: "flex", gap: 16, alignItems: "center",
                padding: "12px 16px",
                background: "#fff",
                borderRadius: 10,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  overflow: "hidden", flexShrink: 0, position: "relative",
                  boxShadow: "0 2px 8px rgba(74,100,34,0.12)",
                  background: "#F9F6F0",
                }}>
                  <Image src={h.img} alt={h.name} fill
                    style={{ objectFit: "cover" }} sizes="52px" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A14", marginBottom: 1 }}>{h.name}</p>
                  <p style={{ fontSize: 11, fontStyle: "italic", color: "#bbb", marginBottom: 3 }}>{h.bot}</p>
                  <p style={{ fontSize: 12, color: "#5C5647", lineHeight: 1.6, margin: 0 }}>{h.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
