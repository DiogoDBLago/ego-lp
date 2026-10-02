"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

const CELL = 96; // mesmo valor de --cell no CSS

// O grid do site atual, fixo atrás de tudo. No hero ele é plano; conforme o
// scroll avança ele deita e vira a "pista" que acompanha o resto da página.
export default function GridFloor() {
  const floor = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const horizon = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const tilt = {
        trigger: "#inicio",
        start: "top top",
        end: "bottom top",
        scrub: true,
      };

      gsap.to(floor.current, {
        rotationX: 66,
        "--solid": "0%",
        "--end": "78%",
        ease: "none",
        scrollTrigger: tilt,
      });
      gsap.fromTo(
        horizon.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: "none", scrollTrigger: tilt },
      );

      // A pista "anda" na direção de quem rola a página.
      const setY = gsap.quickSetter(grid.current, "y", "px");
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => setY((self.scroll() * 0.5) % CELL),
      });
    });

    return () => mm.revert();
  });

  return (
    <div className="floor-wrap" aria-hidden="true">
      <div className="floor" ref={floor}>
        <div className="floor-grid" ref={grid} />
      </div>
      <div className="floor-horizon" ref={horizon} />
    </div>
  );
}
