"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "left" | "right" | "up";

export default function AnimateOnScroll({
  children,
  direction = "up",
}: {
  children: ReactNode;
  direction?: Direction;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform =
    direction === "left"
      ? "translate3d(-36px, 0, 0)"
      : direction === "right"
        ? "translate3d(36px, 0, 0)"
        : "translate3d(0, 28px, 0)";

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0, 0, 0)" : hiddenTransform,
        transition: "opacity 0.75s ease, transform 0.75s ease",
      }}
    >
      {children}
    </div>
  );
}
