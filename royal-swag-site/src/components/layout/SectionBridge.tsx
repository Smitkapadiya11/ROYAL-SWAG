/** 40px transition band between sections (premium rhythm, no phantom height). */
export function SectionBridge({ from, to }: { from: string; to: string }) {
  return (
    <div
      aria-hidden
      className="h-10 w-full shrink-0"
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    />
  );
}

/** Spec: subtle depth strip on dark green (#0D3B1F → #0a2e18). */
export function PremiumSectionDepth() {
  return <SectionBridge from="#0D3B1F" to="#0a2e18" />;
}

export function SectionHairline() {
  return <div aria-hidden className="h-px w-full shrink-0 bg-[var(--brand-sage)]/35" />;
}
