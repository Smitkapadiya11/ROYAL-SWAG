import { SITE_CONFIG } from "@/lib/config";

export default function Footer() {
  return (
    <footer style={{ background: "#0a1f0a", color: "#fff", padding: "40px 24px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, marginBottom: 32 }}>
          {/* Brand */}
          <div style={{ flex: "1 1 220px" }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>ROYAL SWAG</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 12 }}>estd. 2016</div>
            <p style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6, marginBottom: 8 }}>
              Premium Ayurvedic lung detox tea crafted from ancient herbs. Breathe clean. Live free.
            </p>
            <p style={{ fontSize: 12, opacity: 0.6 }}>
              {SITE_CONFIG.companyName}
              <br />
              {SITE_CONFIG.address.line1}
              <br />
              {SITE_CONFIG.address.line2}
            </p>
          </div>

          {/* Navigate */}
          <div style={{ flex: "1 1 140px" }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Navigate</div>
            {[
              { label: "Home", href: "/" },
              { label: "Free Lung Test", href: "/lung-test" },
              { label: "Our Product", href: "/product" },
              { label: "About Us", href: "/about" },
              { label: "Reviews", href: "/reviews" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: "block",
                  color: "#ccc",
                  fontSize: 13,
                  marginBottom: 6,
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div style={{ flex: "1 1 180px" }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Contact</div>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 6, textDecoration: "none" }}
            >
              {SITE_CONFIG.email}
            </a>
            <a
              href={SITE_CONFIG.whatsapp.url}
              style={{ display: "block", color: "#ccc", fontSize: 13, marginBottom: 6, textDecoration: "none" }}
            >
              {SITE_CONFIG.phone.display}
            </a>
            <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>Mon–Sat, 10am–6pm IST</p>
          </div>
        </div>

        {/* Social Links */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          {[
            { label: "Instagram", href: SITE_CONFIG.social.instagram },
            { label: "YouTube", href: SITE_CONFIG.social.youtube },
            { label: "Facebook", href: SITE_CONFIG.social.facebook },
            { label: "Twitter", href: SITE_CONFIG.social.twitter },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#aaa", fontSize: 12, textDecoration: "none" }}
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid #1a3a1a",
            paddingTop: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>
            © 2016–2026 Royal Swag. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <a
              href="https://foscos.fssai.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: "#aaa", textDecoration: "none" }}
            >
              FSSAI Lic. No. {SITE_CONFIG.fssai}
            </a>
            <a href="/privacy" style={{ fontSize: 12, color: "#aaa", textDecoration: "none" }}>
              Privacy
            </a>
            <a href="/terms" style={{ fontSize: 12, color: "#aaa", textDecoration: "none" }}>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
