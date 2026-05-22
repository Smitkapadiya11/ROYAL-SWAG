"use client";

import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
        router.push("/product");
      }}
    >
      {children}
    </a>
  );
}
