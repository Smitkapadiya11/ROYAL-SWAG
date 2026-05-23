export function PriceDisplay({
  price,
  mrp,
  size = "lg",
}: {
  price: number;
  mrp: number;
  size?: "sm" | "lg";
}) {
  const saving = Math.round(((mrp - price) / mrp) * 100);
  const savedAmount = mrp - price;

  if (size === "sm") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-number text-2xl font-bold text-[#324023]">
          ₹{price}
        </span>
        <span className="font-sans text-sm text-[#75786e] line-through decoration-[#ba1a1a]/60">
          ₹{mrp}
        </span>
        <span className="rounded-full bg-[#9A6F1A]/10 px-2 py-0.5 font-sans text-[10px] font-bold text-[#9A6F1A]">
          {saving}% OFF
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-number text-[40px] font-bold leading-none text-[#324023]">
          ₹{price.toLocaleString("en-IN")}
        </span>
        <div className="flex flex-col">
          <span className="font-sans text-xs uppercase tracking-wide text-[#75786e]">
            MRP
          </span>
          <span className="font-number text-lg text-[#75786e] line-through decoration-[#ba1a1a] decoration-2">
            ₹{mrp.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ba1a1a] px-3 py-1 font-sans text-xs font-bold text-white">
          💰 Save ₹{savedAmount} ({saving}% OFF)
        </span>
        <span className="font-sans text-xs text-[#45483f]">incl. all taxes</span>
      </div>
    </div>
  );
}
