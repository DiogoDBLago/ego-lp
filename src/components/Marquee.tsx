"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

const REPEAT = 8;
const BASE_SPEED = 70; // px por segundo com a página parada

// Faixa verde do site atual. Aqui ela acelera e inclina com a velocidade do scroll.
export default function Marquee({ text = "Domine o mercado com Ego" }: { text?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const el = track.current!;
      const setX = gsap.quickSetter(el, "x", "px");
      const setSkew = gsap.quickSetter(el, "skewX", "deg");
      let x = 0;
      let velocity = 0;
      let direction = -1;

      const trigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          velocity = self.getVelocity();
        },
      });

      const tick = (_time: number, delta: number) => {
        velocity *= 0.9;
        if (velocity > 20) direction = -1;
        if (velocity < -20) direction = 1;
        const speed = BASE_SPEED + Math.min(Math.abs(velocity) * 0.3, 1100);
        const half = el.scrollWidth / 2;
        x = gsap.utils.wrap(-half, 0, x + (direction * speed * delta) / 1000);
        setX(x);
        setSkew(gsap.utils.clamp(-14, 14, velocity / -110));
      };

      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        trigger.kill();
      };
    });

    return () => mm.revert();
  });

  const half = (hidden: boolean) => (
    <div className="mq-half" aria-hidden={hidden}>
      {Array.from({ length: REPEAT }, (_, i) => (
        <span className="mq-item display" key={i}>
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <div className="mq" ref={root}>
      <p className="sr-only">{text}</p>
      <div className="mq-track" ref={track} aria-hidden="true">
        {half(true)}
        {half(true)}
      </div>
    </div>
  );
}
