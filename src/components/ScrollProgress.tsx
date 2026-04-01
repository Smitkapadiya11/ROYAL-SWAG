'use client';
import { useEffect } from 'react';

export default function ScrollProgress() {
  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      
      const bar = document.createElement('div');
      bar.style.cssText = `
        position:fixed; top:0; left:0; height:3px;
        background:linear-gradient(90deg, #2d6a4f, #c9a84c);
        z-index:99999; width:0%; transform-origin:left;
      `;
      document.body.appendChild(bar);
      
      ScrollTrigger.create({
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          gsap.set(bar, { width: `${self.progress * 100}%` });
        }
      });
    };
    init();
  }, []);
  return null;
}
