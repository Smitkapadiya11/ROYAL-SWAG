import { URGENCY_CONFIG } from "@/lib/urgency-config";
import { cn } from "@/lib/utils";

type ProductSocialProofProps = {
  className?: string;
};

/** Static urgency lines below primary Buy CTA */
export default function ProductSocialProof({ className }: ProductSocialProofProps) {
  const { stockCount, orderCount } = URGENCY_CONFIG;

  return (
    <ul
      className={cn(
        "mt-4 space-y-1.5 font-body text-xs leading-relaxed text-[rgba(50,64,35,0.65)]",
        className
      )}
    >
      <li>Only {stockCount} packs left at this price</li>
      <li>🔥 {orderCount} people ordered in last 24 hours</li>
      <li>Free delivery on all orders. Ships in 24 hours.</li>
    </ul>
  );
}
