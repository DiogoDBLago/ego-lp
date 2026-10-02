"use client";

import { useRef } from "react";
import RatingCard from "./RatingCard";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { PILLARS } from "@/lib/content";

const REST_ANGLE = [-4, 2, -2];
// Quanto de scroll a seção fica fixada, em % da altura da tela.
// Cada selo novo aparece a cada ~1/3 disso; aumente para dar mais tempo de leitura.
const PIN_LENGTH = 100;

// Seção fixada: a cada trecho de scroll um selo "carimba" a tela e troca o texto.
export default function Rating() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      mm.add(MOTION_OK, () => {
        const el = root.current!;
        const stage = el.querySelector(".rate-stage");
        const cards = gsap.utils.toArray<HTMLElement>(".rate-card", el);
        const copies = gsap.utils.toArray<HTMLElement>(".rate-copy", el);
        el.classList.add("is-live");
        gsap.set(copies, { autoAlpha: 0, y: 14 });

        const stamps = cards.map((card, i) =>
          gsap
            .timeline({ paused: true })
            .fromTo(
              card,
              { autoAlpha: 0, scale: 2.8, rotation: REST_ANGLE[i] * 5 },
              { autoAlpha: 1, scale: 1, rotation: REST_ANGLE[i], duration: 0.34, ease: "power4.in" },
            )
            // o impacto: a mesa treme quando o selo encosta
            .to(stage, { x: -8, y: 6, duration: 0.01 })
            .to(stage, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1.4, 0.22)" }),
        );

        let shown = 0;
        const show = (count: number) => {
          if (count === shown) return;
          stamps.forEach((stamp, i) => {
            if (i < count) stamp.timeScale(1).play();
            else stamp.timeScale(2.5).reverse();
          });
          copies.forEach((copy, i) => {
            const on = i === count - 1;
            gsap.to(copy, { autoAlpha: on ? 1 : 0, y: on ? 0 : 14, duration: 0.3, overwrite: true });
          });
          shown = count;
        };

        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          onEnter: () => show(Math.max(shown, 1)),
          onLeaveBack: () => show(0),
        });
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: `+=${PIN_LENGTH}%`,
          pin: true,
          onUpdate: (self) => show(self.progress < 0.28 ? 1 : self.progress < 0.6 ? 2 : 3),
        });

        return () => el.classList.remove("is-live");
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="rate" id="ego" ref={root}>
      <div className="rate-grid">
        <div className="rate-stage">
          {PILLARS.map((pillar) => (
            <div className="rate-slot" key={pillar.letter}>
              <RatingCard className="rate-card" letter={pillar.letter} label={pillar.label} />
            </div>
          ))}
        </div>

        <div className="rate-side">
          <h2 className="rate-lead">Todo conteúdo que sai daqui leva três selos.</h2>
          <div className="rate-copies">
            {PILLARS.map((pillar) => (
              <div className="rate-copy" key={pillar.letter}>
                <p className="rate-word display">{pillar.label}</p>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
