"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

// Puxa o botão de leve na direção do cursor.
export default function Magnetic({ children }: { children: ReactNode }) {
  const el = useRef<HTMLSpanElement>(null);

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse" || !window.matchMedia(MOTION_OK).matches) return;
    const box = el.current!.getBoundingClientRect();
    gsap.to(el.current, {
      x: (event.clientX - (box.left + box.width / 2)) * 0.3,
      y: (event.clientY - (box.top + box.height / 2)) * 0.4,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    gsap.to(el.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <span className="magnetic" ref={el} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </span>
  );
}
