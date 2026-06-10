import { cn } from "@/lib/utils";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type SectionBg = "cream" | "white" | "green" | "surface" | "transparent";

const bgClass: Record<SectionBg, string> = {
  cream: "layout-section--bg-cream",
  white: "layout-section--bg-white",
  green: "layout-section--bg-green",
  surface: "layout-section--bg-surface",
  transparent: "layout-section--bg-transparent",
};

export type SectionProps<T extends ElementType = "section"> = {
  as?: T;
  bg?: SectionBg;
  compact?: boolean;
  id?: string;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "id">;

export function Section<T extends ElementType = "section">({
  as,
  bg = "transparent",
  compact = false,
  id,
  children,
  className,
  ...rest
}: SectionProps<T>) {
  const Component = (as ?? "section") as ElementType;

  return (
    <Component
      id={id}
      className={cn(
        "layout-section",
        bgClass[bg],
        compact && "layout-section--compact",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
