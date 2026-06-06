"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBagIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        opacity={active ? 0.15 : 1}
      />
    </svg>
  );
}

function LungIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 4c-2 0-3 2-3 4v5c0 3 2 5 5 5 .8 0 1.5-.2 2-.5.5.3 1.2.5 2 .5 3 0 5-2 5-5V8c0-2-1-4-3-4-1.2 0-2 .7-2.5 1.5C10 4.7 9.2 4 8 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 10v6M12 7h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/", label: "Home", renderIcon: (active: boolean) => <HomeIcon active={active} /> },
  {
    href: "/product",
    label: "Shop",
    renderIcon: () => <ShoppingBagIcon size={20} />,
  },
  { href: "/lung-test", label: "Test", renderIcon: () => <LungIcon /> },
  { href: "/about", label: "About", renderIcon: () => <AboutIcon /> },
] as const;

export default function MobileBottomNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      className="bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-white/60 bg-glass-surface/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Mobile primary"
    >
      <ul className="grid h-16 grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "bottom-nav-link flex h-full min-h-[44px] flex-col items-center justify-center gap-0.5 font-body text-[10px] font-medium transition-colors duration-200",
                  active
                    ? "bottom-nav-link--active text-primary"
                    : "text-on-surface-variant hover:text-primary"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="flex h-5 items-center justify-center" aria-hidden>
                  {item.renderIcon(active)}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
