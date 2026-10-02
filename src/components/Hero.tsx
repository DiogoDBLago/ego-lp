"use client";

import { useRef } from "react";
import Logo from "./Logo";
import Marquee from "./Marquee";
import Magnetic from "./Magnetic";
import RatingCard from "./RatingCard";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { PILLARS } from "@/lib/content";

const TITLE = "Resultados que impactam";
const GLYPHS = "<>/\\[]{}=+*#_";

// Revela o texto da esquerda para a direita; o que ainda falta aparece embaralhado.
function decode(el: HTMLElement, text: string, duration: number) {
  const state = { progress: 0 };
  return gsap.to(state, {
    progress: 1,
    duration,
    ease: "none",
    onUpdate: () => {
      const done = Math.floor(state.progress * text.length);
      let out = text.slice(0, done);
      for (let i = done; i < text.length; i++) {
        out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = text;
    },
  });
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      mm.add(MOTION_OK, () => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

        intro
          .set(".logo-swoosh-rect", { attr: { width: 0 } })
          .set(".hero-logo", { autoAlpha: 1 })
          .to(".logo-swoosh-rect", { attr: { width: 2400 }, duration: 0.9, ease: "power2.inOut" })
          .fromTo(
            ".logo-word",
            { autoAlpha: 0, x: -90 },
            { autoAlpha: 1, x: 0, duration: 0.55 },
            "-=0.4",
          )
          .set(".hero-title", { autoAlpha: 1 }, "-=0.15")
          .add(decode(title.current!, TITLE, 0.9), "<")
          .fromTo(
            ".hero-sub, .hero-cta",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
            "-=0.45",
          )
          .fromTo(
            ".hero-seal",
            { autoAlpha: 0, scale: 1.9, rotation: -14 },
            { autoAlpha: 1, scale: 1, rotation: -4, duration: 0.3, ease: "power4.in" },
            "-=0.25",
          );

        gsap.to(".hero-inner", {
          yPercent: -14,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "65% top", scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="hero" id="inicio" ref={root}>
      <div className="hero-inner">
        <div className="hero-logo" data-intro>
          <Logo animated />
        </div>
        <h1 className="hero-title display" aria-label={TITLE} data-intro>
          <span ref={title} aria-hidden="true">
            {TITLE}
          </span>
        </h1>
        <p className="hero-sub" data-intro>
          Ousamos, criamos e acreditamos que o subversivo é sinônimo de genialidade.
        </p>
        <div className="hero-cta" data-intro>
          <Magnetic>
            <a className="btn btn-primary" href="#contato">
              Domine a mídia
            </a>
          </Magnetic>
          <a className="btn btn-ghost" href="#portfolio">
            Ver portfólio
          </a>
        </div>
      </div>

      <a className="hero-seal" href="#ego" aria-label="Explosive, Genuine, Obsessive: ver os três selos" data-intro>
        {PILLARS.map((pillar) => (
          <RatingCard key={pillar.letter} letter={pillar.letter} label={pillar.label} />
        ))}
      </a>

      <Marquee />
    </section>
  );
}
