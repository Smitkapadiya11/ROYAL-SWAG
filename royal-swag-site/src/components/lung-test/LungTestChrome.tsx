"use client";

import { useLayoutEffect } from "react";

/** Hides site header/footer on lung-test routes without layout flash. */
export function LungTestChrome() {
  useLayoutEffect(() => {
    document.documentElement.classList.add("lung-test-route");
    document.body.classList.add("lung-test-page");
    return () => {
      document.documentElement.classList.remove("lung-test-route");
      document.body.classList.remove("lung-test-page");
    };
  }, []);

  return null;
}
