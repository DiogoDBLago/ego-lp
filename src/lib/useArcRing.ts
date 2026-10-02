"use client";

import { useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

const DRIFT = 26; // px por segundo com a página parada
const EASE = 4; // quão rápido a velocidade volta ao normal (1/s)
const DRAG_THRESHOLD = 6;

// Dispõe os cartões num arco côncavo em 3D (como uma tela de cinema curva).
// A seção não prende o scroll: o arco gira sozinho, acelera com a rolagem
// e pode ser arrastado. Com `media`, o arco só existe enquanto a query casar.
export function useArcRing(
  root: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLElement | null>,
  cardSelector: string,
  media?: string,
) {
  const sim = useRef({ offset: 0, velocity: 0, span: 0, hover: false, dragging: false, paused: false });

  useGSAP(
    () => {
      const setup = () => {
        const el = stage.current!;
        const cards = gsap.utils.toArray<HTMLElement>(cardSelector, el);
        const state = sim.current;
        const motion = window.matchMedia(MOTION_OK).matches;
        let total = 0;
        let radius = 0;
        let inView = false;
        let direction = -1;
        let scrollVelocity = 0;

        el.classList.add("is-ring");

        const measure = () => {
          const width = cards[0].offsetWidth;
          state.span = width * 1.08;
          total = state.span * cards.length;
          radius = Math.max(window.innerWidth, 720) * 1.5; // raio maior = arco mais suave
          el.style.perspective = `${radius}px`;
        };

        const render = () => {
          cards.forEach((card, i) => {
            const arc = gsap.utils.wrap(-total / 2, total / 2, i * state.span + state.offset);
            const angle = arc / radius;
            if (Math.abs(angle) > 1) {
              card.style.visibility = "hidden";
              return;
            }
            const x = Math.sin(angle) * radius;
            const z = (1 - Math.cos(angle)) * radius;
            card.style.visibility = "visible";
            card.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${-angle}rad)`;
            card.style.setProperty("--dim", String(1 - Math.min(Math.abs(angle) / 0.5, 1) * 0.5));
          });
        };

        const tick = (_time: number, delta: number) => {
          if (!inView) return;
          const dt = Math.min(delta, 64) / 1000;
          scrollVelocity *= 0.9;
          if (!state.dragging) {
            if (scrollVelocity > 30) direction = -1;
            if (scrollVelocity < -30) direction = 1;
            const still = !motion || state.paused;
            const drift = still || state.hover ? 0 : direction * DRIFT;
            const boost = still ? 0 : gsap.utils.clamp(-1400, 1400, scrollVelocity * 0.45);
            state.velocity += (drift - boost - state.velocity) * Math.min(1, dt * EASE);
            state.offset += state.velocity * dt;
          }
          render();
        };

        // Arrastar (mouse ou dedo). Só captura o ponteiro depois de um movimento
        // real, para o clique simples continuar chegando ao cartão.
        let drag: { id: number; startX: number; startOffset: number; lastX: number; lastT: number; moved: boolean } | null =
          null;

        const onDown = (event: PointerEvent) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          drag = {
            id: event.pointerId,
            startX: event.clientX,
            startOffset: state.offset,
            lastX: event.clientX,
            lastT: performance.now(),
            moved: false,
          };
        };
        const onMove = (event: PointerEvent) => {
          if (!drag || event.pointerId !== drag.id) return;
          const dx = event.clientX - drag.startX;
          if (!drag.moved && Math.abs(dx) > DRAG_THRESHOLD) {
            drag.moved = true;
            state.dragging = true;
            el.setPointerCapture(drag.id);
            el.classList.add("is-dragging");
          }
          if (!drag.moved) return;
          const now = performance.now();
          const speed = ((event.clientX - drag.lastX) / Math.max(now - drag.lastT, 1)) * 1000;
          state.velocity = state.velocity * 0.5 + speed * 0.5;
          state.offset = drag.startOffset + dx;
          drag.lastX = event.clientX;
          drag.lastT = now;
        };
        const onUp = () => {
          drag = null;
          state.dragging = false;
          el.classList.remove("is-dragging");
        };
        const onEnter = (event: PointerEvent) => {
          if (event.pointerType === "mouse") state.hover = true;
        };
        const onLeave = () => {
          state.hover = false;
        };
        const onResize = () => {
          measure();
          render();
        };

        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        window.addEventListener("resize", onResize);

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            inView = self.isActive;
          },
          onUpdate: (self) => {
            scrollVelocity = self.getVelocity();
          },
          // entra girando e assenta: o único momento "automático" da seção
          onEnter: () => {
            if (motion) state.velocity = -1100;
          },
        });

        measure();
        render();
        gsap.ticker.add(tick);

        return () => {
          gsap.ticker.remove(tick);
          window.removeEventListener("resize", onResize);
          el.removeEventListener("pointerdown", onDown);
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerup", onUp);
          el.removeEventListener("pointercancel", onUp);
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointerleave", onLeave);
          el.classList.remove("is-ring", "is-dragging");
          el.style.perspective = "";
          cards.forEach((card) => {
            card.style.visibility = "";
            card.style.transform = "";
            card.style.removeProperty("--dim");
          });
        };
      };

      if (!media) return setup();
      const mm = gsap.matchMedia();
      mm.add(media, setup);
      return () => mm.revert();
    },
    { scope: root },
  );

  // Um empurrão que, com a desaceleração de EASE, anda exatamente um cartão.
  const nudge = (step: number) => {
    sim.current.velocity -= step * sim.current.span * EASE;
  };

  return { sim, nudge };
}
