import { cn } from "@/lib/utils";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type GridBreakpointCols = {
  mobile?: number;
  tablet?: number;
  desktop?: number;
};

export type GridColSpan = {
  mobile?: number;
  tablet?: number;
  desktop?: number;
};

export type GridGap = "sm" | "md" | "lg" | "xl";

export type GridVariant =
  | "default"
  | "12"
  | "auto"
  | "cards"
  | "herbs"
  | "doctors"
  | "stats"
  | "split"
  | "sidebar"
  | "product"
  | "certs"
  | "hero";

const variantClass: Record<GridVariant, string | undefined> = {
  default: undefined,
  "12": "layout-grid--12",
  auto: "layout-grid--auto",
  cards: "layout-grid--cards",
  herbs: "layout-grid--herbs",
  doctors: "layout-grid--doctors",
  stats: "layout-grid--stats",
  split: "layout-grid--split",
  sidebar: "layout-grid--sidebar",
  product: "layout-grid--product",
  certs: "layout-grid--certs",
  hero: "layout-grid--hero",
};

const gapClass: Record<GridGap, string> = {
  sm: "layout-grid--gap-sm",
  md: "layout-grid--gap-md",
  lg: "layout-grid--gap-lg",
  xl: "layout-grid--gap-xl",
};

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  cols?: GridBreakpointCols;
  /** @deprecated Prefer `variant="12"` */
  twelveCol?: boolean;
  variant?: GridVariant;
  gap?: GridGap;
  align?: "start" | "center" | "end" | "stretch";
  children: ReactNode;
};

export function Grid({
  cols,
  twelveCol = false,
  variant = "default",
  gap,
  align,
  children,
  className,
  style,
  ...rest
}: GridProps) {
  const resolvedVariant = twelveCol ? "12" : variant;

  const gridStyle = {
    ...(cols?.mobile != null && { "--grid-cols-mobile": cols.mobile }),
    ...(cols?.tablet != null && { "--grid-cols-tablet": cols.tablet }),
    ...(cols?.desktop != null && { "--grid-cols-desktop": cols.desktop }),
    ...(align && { "--grid-align": align }),
    ...style,
  } as CSSProperties;

  const usesLayoutGrid =
    resolvedVariant === "default" || resolvedVariant === "12";

  return (
    <div
      className={cn(
        usesLayoutGrid && "layout-grid",
        variantClass[resolvedVariant],
        gap && gapClass[gap],
        className
      )}
      style={gridStyle}
      {...rest}
    >
      {children}
    </div>
  );
}

export type GridColProps = HTMLAttributes<HTMLDivElement> & {
  span?: GridColSpan;
  children: ReactNode;
};

export function GridCol({
  span = { mobile: 4, tablet: 6, desktop: 12 },
  children,
  className,
  style,
  ...rest
}: GridColProps) {
  const colStyle = {
    "--col-span-mobile": span.mobile ?? 4,
    "--col-span-tablet": span.tablet ?? 6,
    "--col-span-desktop": span.desktop ?? 12,
    ...style,
  } as CSSProperties;

  return (
    <div className={cn("layout-grid-col min-w-0", className)} style={colStyle} {...rest}>
      {children}
    </div>
  );
}
