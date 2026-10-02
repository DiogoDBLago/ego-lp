"use client";

import { useRef } from "react";
import Chevron from "./Chevron";
import SectionTitle from "./SectionTitle";
import { useArcRing } from "@/lib/useArcRing";
import { FEEDBACKS } from "@/lib/content";

const MOBILE = "(max-width: 899px)"; // mesmo corte do CSS

// No desktop é uma grade; no mobile os cartões giram no mesmo arco do portfólio.
export default function Feedbacks() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const { nudge } = useArcRing(root, stage, ".fb-card", MOBILE);

  return (
    <section className="sec fb" id="feedbacks" ref={root}>
      <div className="wrap">
        <div className="fb-head">
          <div>
            <SectionTitle>Feedbacks</SectionTitle>
            <p className="pf-hint fb-hint">Arraste para girar.</p>
          </div>
          <div className="pf-arrows fb-arrows">
            <button type="button" className="pf-arrow" onClick={() => nudge(-1)} aria-label="Feedback anterior">
              <Chevron flip />
            </button>
            <button type="button" className="pf-arrow" onClick={() => nudge(1)} aria-label="Próximo feedback">
              <Chevron />
            </button>
          </div>
        </div>

        <div className="fb-stage" ref={stage}>
          <ul className="fb-grid">
            {FEEDBACKS.map((feedback) => (
              <li className="fb-card" key={feedback.name}>
                <span className="fb-stars" role="img" aria-label="5 de 5 estrelas">
                  ★★★★★
                </span>
                <blockquote>{feedback.quote}</blockquote>
                <footer>
                  <strong>{feedback.name}</strong>
                  <span>{feedback.where}</span>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
