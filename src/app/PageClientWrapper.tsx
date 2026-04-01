"use client";

import { useEffect } from "react";

export default function PageClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let ctx: any;
    const init = async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        gsap.from(".page-wrapper", {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      });
    };
    init();
    return () => ctx?.revert();
  }, []);

  return <div className="page-wrapper">{children}</div>;
}
