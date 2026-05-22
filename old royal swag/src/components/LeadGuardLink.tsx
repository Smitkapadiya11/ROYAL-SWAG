"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { isProductPath } from "@/lib/is-product-path";

type Props = Omit<ComponentProps<typeof Link>, "onClick" | "children" | "href"> & {
  /** String path only — required for lead guard + `router.push`. */
  href: string;
  /** Runs after lead is captured (or already valid), right before navigation. */
  onProceed?: () => void;
  /** Used only when `href` is not a product path. */
  onClick?: ComponentProps<typeof Link>["onClick"];
  children?: ComponentProps<typeof Link>["children"];
};

/** Wraps navigation to `/product` behind lead capture when needed. */
export function LeadGuardLink({ href, onClick, onProceed, children, ...rest }: Props) {
  const router = useRouter();

  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        if (isProductPath(href)) {
          e.preventDefault();
          onProceed?.();
          router.push("/product");
          return;
        }
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}
