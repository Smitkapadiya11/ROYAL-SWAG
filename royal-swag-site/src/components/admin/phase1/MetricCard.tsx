import { cn } from "@/lib/utils";

export default function MetricCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl px-4 py-3",
        className
      )}
    >
      <p className="font-body text-xs uppercase tracking-wide text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 font-number text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}
