import { cn } from "@/lib/utils";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type ContainerSize = "sm" | "md" | "lg" | "full";

const sizeClass: Record<ContainerSize, string> = {
  sm: "layout-container--sm",
  md: "layout-container--md",
  lg: "",
  full: "layout-container--full",
};

export type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  size?: ContainerSize;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "className">;

export function Container<T extends ElementType = "div">({
  as,
  size = "lg",
  children,
  className,
  ...rest
}: ContainerProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={cn("layout-container", sizeClass[size], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
