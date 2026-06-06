const fs = require("fs");
const p = "E:/projects/Royal swag/old royal swag/src/components/ui/ProductSocialProof.tsx";
const d = "d" + "iv";
const o = (cls, inner) => "<" + d + ' className="' + cls + '">' + inner + "</" + d + ">";
const content = `import { URGENCY_CONFIG } from "@/lib/urgency-config";
import { cn } from "@/lib/utils";

type ProductSocialProofProps = {
  className?: string;
};

const AVATAR_INITIALS = ["S", "R", "P", "M"] as const;
const AVATAR_COLORS = ["#324023", "#495738", "#9A6F1A", "#6b7a5a"] as const;

export default function ProductSocialProof({ className }: ProductSocialProofProps) {
  const stockCount = URGENCY_CONFIG.stockCount;
  const orderCount = URGENCY_CONFIG.orderCount;
  const stockPct = Math.min(100, Math.max(8, Math.round((stockCount / 165) * 100)));

  return (
    <${d} className={cn("my-4 flex flex-col gap-2 px-5", className)}>
      <${d} className="glass-card flex items-center gap-3 rounded-xl px-4 py-3">
        <${d} className="flex flex-1 flex-col">
          <${d} className="mb-1.5 flex items-center justify-between">
            <span className="font-sans text-xs font-semibold text-[#324023]">
              ${String.fromCodePoint(0x1f525)} Only <span className="font-number tabular-nums">{stockCount}</span> packs left
            </span>
            <span className="font-sans text-[10px] font-bold text-[#ba1a1a]">Selling fast</span>
          </${d}>
          <${d} className="h-1.5 w-full overflow-hidden rounded-full bg-[#dee5d1]">
            <${d}
              className="h-full rounded-full bg-gradient-to-r from-[#9A6F1A] to-[#ba1a1a]"
              style={{ width: \`\${stockPct}%\` }}
            />
          </${d}>
          <p className="mt-1 font-sans text-[10px] text-[#45483f]">
            127 sold this week ${"\u00B7"} Limited batch pricing
          </p>
        </${d}>
      </${d}>
      <${d} className="flex items-center gap-3 rounded-xl border border-[#324023]/10 bg-[#324023]/5 px-4 py-2.5">
        <${d} className="flex -space-x-2">
          {AVATAR_INITIALS.map((initial, i) => (
            <${d}
              key={initial}
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white"
              style={{ background: AVATAR_COLORS[i] }}
            >
              {initial}
            </${d}>
          ))}
        </${d}>
        <p className="font-sans text-xs text-[#45483f]">
          <span className="font-semibold text-[#324023]">
            <span className="font-number tabular-nums">{orderCount}</span> people
          </span>{" "}
          ordered in last 24 hours
        </p>
      </${d}>
      <${d} className="flex items-center gap-2 px-4 py-2">
        <span className="text-sm">${String.fromCodePoint(0x2705)}</span>
        <span className="font-sans text-xs text-[#45483f]">
          <span className="font-semibold text-[#324023]">Free delivery</span> on all orders ${"\u00B7"} Ships within 24 hours
        </span>
      </${d}>
    </${d}>
  );
}
`;
fs.writeFileSync(p, content, "utf8");
console.log("rewrote ProductSocialProof");
