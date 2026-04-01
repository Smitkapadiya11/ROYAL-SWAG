'use client';
import { useEffect } from 'react';

export default function CursorTrail() {
  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const dots: HTMLElement[] = [];
      for (let i = 0; i < 8; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
          position:fixed; width:${10 - i}px; height:${10 - i}px;
          background:rgba(45,106,79,${0.6 - i * 0.07});
          border-radius:50%; pointer-events:none;
          z-index:9999; top:0; left:0;
          transform:translate(-50%,-50%);
        `;
        document.body.appendChild(dot);
        dots.push(dot);
      }
      let mouseX = 0, mouseY = 0;
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        gsap.to(dots[0], { x: mouseX, y: mouseY, duration: 0.1 });
        dots.forEach((dot, i) => {
          if (i === 0) return;
          gsap.to(dot, { 
            x: mouseX, y: mouseY, 
            duration: 0.1 + i * 0.06,
            ease: 'power1.out'
          });
        });
      });
    };
    init();
  }, []);
  return null;
}
