"use client";

import { APP_SITE } from "@/lib/config";
import { EVENTS, trackEvent } from "@/lib/events";

const WA_MESSAGE =
  "Hi, I want to order Royal Swag Progress Pack (2 packs, ₹599). Please share payment details.";

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const phone = normalizePhone(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || APP_SITE.whatsapp
  );

  const handleClick = () => {
    const message = encodeURIComponent(WA_MESSAGE);
    const url = `https://wa.me/${phone}?text=${message}`;

    trackEvent(EVENTS.WHATSAPP_CLICK, { page: window.location.pathname });

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="wa-float-root">
        <span className="wa-pulse-ring" aria-hidden />
        <button
          type="button"
          className="wa-float-btn"
          onClick={handleClick}
          data-track-button="whatsapp-float"
          data-track-label="Order on WhatsApp"
          aria-label="Order on WhatsApp"
        >
          <span className="wa-float-icon">
            <WhatsAppIcon />
          </span>
          <span className="wa-float-label">Order on WhatsApp</span>
        </button>
        <span className="wa-float-tooltip" role="tooltip">
          Order on WhatsApp
        </span>
      </div>

      <style jsx>{`
        .wa-float-root {
          position: fixed;
          right: 20px;
          bottom: 88px;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wa-pulse-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: #25d366;
          pointer-events: none;
          animation: waRingPulse 2s ease-out infinite;
        }

        @keyframes waRingPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .wa-float-btn {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 56px;
          min-width: 56px;
          padding: 0 18px 0 14px;
          border: none;
          border-radius: 9999px;
          background: #25d366;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.45);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          font-family: var(--font-hanken, system-ui, sans-serif);
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .wa-float-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(37, 211, 102, 0.55);
        }

        .wa-float-btn:active {
          transform: translateY(0);
        }

        .wa-float-icon {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
        }

        .wa-float-label {
          display: inline;
        }

        .wa-float-tooltip {
          position: absolute;
          right: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%) translateX(6px);
          padding: 8px 12px;
          border-radius: 8px;
          background: #1a3a1a;
          color: #f4edd6;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .wa-float-tooltip::after {
          content: "";
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: #1a3a1a;
        }

        .wa-float-root:hover .wa-float-tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        @media (min-width: 768px) {
          .wa-float-root {
            bottom: 24px;
          }

          .wa-float-btn {
            width: 56px;
            min-width: 56px;
            padding: 0;
            border-radius: 50%;
          }

          .wa-float-label {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .wa-float-tooltip {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wa-pulse-ring {
            animation: none;
            opacity: 0.35;
          }
        }
      `}</style>
    </>
  );
}