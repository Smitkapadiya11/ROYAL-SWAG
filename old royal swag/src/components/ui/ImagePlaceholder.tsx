export function ImagePlaceholder({
  label = "",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, #324023 0%, #495738 50%, #9A6F1A 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      {label ? (
        <span className="relative z-10 font-display text-sm font-semibold tracking-wide text-white/60">
          {label}
        </span>
      ) : null}
    </div>
  );
}
