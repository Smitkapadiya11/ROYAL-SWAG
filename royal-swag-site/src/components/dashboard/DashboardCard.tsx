import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function DashboardCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-[#1A1D27] p-4 md:p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl border border-white/10 bg-[#1A1D27] p-5",
        className
      )}
    >
      <div className="mb-3 h-4 w-1/3 rounded bg-white/10" />
      <div className="h-8 w-1/2 rounded bg-white/10" />
    </div>
  );
}
