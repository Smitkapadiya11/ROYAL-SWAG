import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";

export default function LungTestHeader() {
  return (
    <header
      className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/60 px-5 backdrop-blur-md md:px-10"
      style={{ background: "rgba(255,255,255,0.45)" }}
    >
      <Link href="/" aria-label="Royal Swag home">
        <BrandLogo variant="on-light" className="h-9 w-auto md:h-10" />
      </Link>
      <span className="rounded-full bg-[#324023]/10 px-3 py-1 font-sans text-xs font-bold text-[#9A6F1A]">
        Free Lung Test
      </span>
    </header>
  );
}
