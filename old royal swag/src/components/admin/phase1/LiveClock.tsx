"use client";

import { useEffect, useState } from "react";

export default function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span className="hidden font-sans text-xs text-[#45483f] md:block">{time}</span>
  );
}
