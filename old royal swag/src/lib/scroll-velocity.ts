let lastScrollY = 0;
let velocity = 0;
let rafId: number;

export function initScrollVelocity(onUpdate: (v: number) => void) {
  const update = () => {
    const current = window.scrollY;
    velocity = Math.min(Math.abs(current - lastScrollY), 80);
    lastScrollY = current;
    onUpdate(velocity);
    rafId = requestAnimationFrame(update);
  };
  rafId = requestAnimationFrame(update);
  return () => cancelAnimationFrame(rafId);
}

/** clamp((velocity / 80) * 0.3, 0, 0.3) */
export function velocityMultiplier(v: number): number {
  return Math.min((v / 80) * 0.3, 0.3);
}
