"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After 30 Days",
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [position, setPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const stopDrag = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
    setShowHint(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  const startDrag = useCallback(
    (clientX: number) => {
      isDragging.current = true;
      updatePosition(clientX);
    },
    [updatePosition]
  );

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full cursor-col-resize select-none overflow-hidden rounded-3xl shadow-lg md:aspect-[4/3]"
      onMouseMove={handleMouseMove}
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={handleTouchMove}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt="After"
          className="h-full w-full object-cover"
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.style.background =
              "linear-gradient(135deg, #324023, #9A6F1A)";
          }}
        />
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt="Before"
          className="absolute inset-0 h-full object-cover"
          style={{
            width: containerWidth ? `${containerWidth}px` : "100%",
            maxWidth: "none",
          }}
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.style.background =
              "linear-gradient(135deg, #6b7280, #374151)";
          }}
        />
      </div>

      <div
        className="absolute bottom-0 top-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)]"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      />

      <div
        className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${position}%` }}
      >
        <div className="flex h-10 w-10 items-center justify-center gap-1 rounded-full bg-white shadow-lg">
          <div className="h-0 w-0 border-b-[5px] border-r-[6px] border-t-[5px] border-b-transparent border-r-[#324023] border-t-transparent" />
          <div className="h-0 w-0 border-b-[5px] border-l-[6px] border-t-[5px] border-b-transparent border-l-[#324023] border-t-transparent" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1.5 font-sans text-xs font-semibold text-white backdrop-blur-sm">
        {beforeLabel}
      </div>
      <div className="absolute bottom-4 right-4 rounded-full bg-[#9A6F1A]/80 px-3 py-1.5 font-sans text-xs font-semibold text-white backdrop-blur-sm">
        {afterLabel}
      </div>

      {showHint ? (
        <div className="pointer-events-none absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/40 px-3 py-1 font-sans text-[10px] font-semibold text-white backdrop-blur-sm">
          ← Drag to Compare →
        </div>
      ) : null}
    </div>
  );
}
