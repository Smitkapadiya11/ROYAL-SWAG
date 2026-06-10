"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/product", label: "Shop", icon: "🛍" },
  { href: "/lung-test", label: "Test", icon: "🫁" },
  { href: "/about", label: "About", icon: "ℹ" },
] as const;

export default function MobileBottomNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      className="bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-white/60 bg-glass-surface backdrop-blur-md md:hidden"
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
                  "bottom-nav-link flex h-full min-h-[44px] flex-col items-center justify-center gap-0.5 font-body text-[10px] font-medium",
                  active
                    ? "bottom-nav-link--active text-primary"
                    : "text-on-surface-variant hover:text-primary"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {item.icon}
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
