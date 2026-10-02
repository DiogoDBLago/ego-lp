"use client";

import { useRef } from "react";
import SectionTitle from "./SectionTitle";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { MANIFESTO } from "@/lib/content";

const WORDS = MANIFESTO.split(" ");
const STRUCK = "agência"; // riscada pelo scroll
const LIT = "produtora,"; // fica verde

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);

      // Só no mobile: no desktop o texto vem logo após os selos E-G-O e
      // duas animações de scroll seguidas pesam, então ele fica estático.
      mm.add(`${MOTION_OK} and (max-width: 899px)`, () => {
        const words = gsap.utils.toArray<HTMLElement>(".mani-w");
        const step = 0.1;
        const at = (selector: string) =>
          words.indexOf(root.current!.querySelector<HTMLElement>(selector)!) * step;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".mani-text",
              start: "top 75%",
              end: "bottom 45%",
              scrub: 0.4,
            },
          })
          .fromTo(words, { opacity: 0.16 }, { opacity: 1, stagger: step, ease: "none" })
          .fromTo(
            ".mani-strike",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.4, ease: "none" },
            at(".is-struck") + 0.3,
          )
          .fromTo(
            ".is-lit",
            { color: "#ffffff" },
            { color: "#34de01", duration: 0.3, ease: "none" },
            at(".is-lit") + 0.2,
          );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="sec mani" id="sobre" ref={root}>
      <div className="wrap">
        <SectionTitle>Sobre nós</SectionTitle>
        <p className="mani-text" aria-label={MANIFESTO}>
          {WORDS.map((word, i) => {
            const struck = word === STRUCK;
            const lit = word === LIT;
            return (
              <span key={i} aria-hidden="true">
                <span className={`mani-w${struck ? " is-struck" : ""}${lit ? " is-lit" : ""}`}>
                  {word}
                  {struck && <span className="mani-strike" />}
                </span>{" "}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
