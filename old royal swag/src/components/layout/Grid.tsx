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

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  cols?: GridBreakpointCols;
  twelveCol?: boolean;
  children: ReactNode;
};

export function Grid({
  cols,
  twelveCol = false,
  children,
  className,
  style,
  ...rest
}: GridProps) {
  const gridStyle = {
    ...(cols?.mobile != null && { "--grid-cols-mobile": cols.mobile }),
    ...(cols?.tablet != null && { "--grid-cols-tablet": cols.tablet }),
    ...(cols?.desktop != null && { "--grid-cols-desktop": cols.desktop }),
    ...style,
  } as CSSProperties;

  return (
    <div
      className={cn("layout-grid", twelveCol && "layout-grid--12", className)}
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
