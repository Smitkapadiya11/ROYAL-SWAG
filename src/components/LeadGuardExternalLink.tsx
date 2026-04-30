"use client";

import { useLeadCapture } from "@/hooks/useLeadCapture";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

/** Opens an external URL (e.g. WhatsApp) after lead capture when needed. */
export default function LeadGuardExternalLink({
  href,
  children,
  className,
  style,
  target = "_blank",
  rel = "noopener noreferrer",
  "aria-label": ariaLabel,
}: Props) {
  const { openLeadModal } = useLeadCapture();

  return (
    <a
      href={href}
      className={className}
      style={style}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.preventDefault();
        openLeadModal(() => window.open(href, target, "noopener,noreferrer"));
      }}
    >
      {children}
    </a>
  );
}
