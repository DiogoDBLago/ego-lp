"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import SectionTitle from "./SectionTitle";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { PORTFOLIO } from "@/lib/content";

const DRIFT = 26; // px por segundo com a página parada
const EASE = 4; // quão rápido a velocidade volta ao normal (1/s)
const DRAG_THRESHOLD = 6;

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d={flip ? "M10.5 2 4.5 8l6 6" : "M5.5 2l6 6-6 6"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
    </svg>
  );
}

// As peças ficam num arco côncavo em 3D (como uma tela de cinema curva).
// A seção não prende o scroll: o arco gira sozinho, acelera com a rolagem,
// pode ser arrastado, e cada peça abre ampliada ao clicar.
export default function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const zoomed = useRef<HTMLImageElement>(null);
  const sim = useRef({ offset: 0, velocity: 0, span: 0, hover: false, dragging: false, paused: false });
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = stage.current!;
      const cards = gsap.utils.toArray<HTMLElement>(".pf-card", el);
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
      // real, para o clique simples continuar abrindo a peça.
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
        el.classList.remove("is-ring");
      };
    },
    { scope: root },
  );

  // Um empurrão que, com a desaceleração de EASE, anda exatamente uma peça.
  const nudge = (step: number) => {
    sim.current.velocity -= step * sim.current.span * EASE;
  };

  const openPiece = (index: number, from: HTMLElement) => {
    const box = dialog.current!;
    const start = from.getBoundingClientRect();
    flushSync(() => setOpen(index)); // a imagem ampliada precisa existir antes de medir
    box.showModal();
    if (!window.matchMedia(MOTION_OK).matches) return;
    const end = zoomed.current!.getBoundingClientRect();
    gsap.fromTo(
      zoomed.current,
      {
        x: start.left + start.width / 2 - (end.left + end.width / 2),
        y: start.top + start.height / 2 - (end.top + end.height / 2),
        scale: start.height / end.height,
      },
      { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
    );
    gsap.fromTo(box, { backgroundColor: "rgba(0,0,0,0)" }, { backgroundColor: "rgba(0,0,0,0.92)", duration: 0.3 });
  };

  const step = (delta: number) => {
    setOpen((current) =>
      current === null ? current : (current + delta + PORTFOLIO.length) % PORTFOLIO.length,
    );
  };

  // Enquanto a peça está ampliada o arco para; rolar a página fecha a ampliação,
  // então o scroll nunca fica preso aqui.
  useEffect(() => {
    sim.current.paused = open !== null;
    if (open === null) return;

    const close = () => dialog.current?.close();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("wheel", close, { passive: true });
    window.addEventListener("touchmove", close, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", close);
      window.removeEventListener("touchmove", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className="pf" id="portfolio" ref={root}>
      <div className="pf-head">
        <div>
          <SectionTitle>Portfólio</SectionTitle>
          <p className="pf-hint">Arraste para girar. Clique numa peça para ampliar.</p>
        </div>
        <div className="pf-arrows">
          <button type="button" className="pf-arrow" onClick={() => nudge(-1)} aria-label="Peça anterior">
            <Chevron flip />
          </button>
          <button type="button" className="pf-arrow" onClick={() => nudge(1)} aria-label="Próxima peça">
            <Chevron />
          </button>
        </div>
      </div>

      <div className="pf-stage" ref={stage}>
        <div className="pf-ring">
          {PORTFOLIO.map((src, i) => (
            <button
              type="button"
              className="pf-card"
              key={src}
              onClick={(event) => openPiece(i, event.currentTarget)}
              aria-label={`Ampliar peça ${i + 1} de ${PORTFOLIO.length}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" decoding="async" draggable={false} />
            </button>
          ))}
          <div className="pf-card pf-end">
            <p className="display">A próxima peça pode ser a sua.</p>
            <a className="btn btn-dark" href="#contato">
              Fale conosco
            </a>
          </div>
        </div>
      </div>

      <dialog
        className="pf-box"
        ref={dialog}
        aria-label="Peça ampliada"
        onClose={() => setOpen(null)}
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
      >
        {open !== null && (
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={zoomed} src={PORTFOLIO[open]} alt={`Peça ${open + 1} criada pela Ego Corp`} />
        )}
        <button type="button" className="pf-arrow pf-box-prev" onClick={() => step(-1)} aria-label="Peça anterior">
          <Chevron flip />
        </button>
        <button type="button" className="pf-arrow pf-box-next" onClick={() => step(1)} aria-label="Próxima peça">
          <Chevron />
        </button>
        <button type="button" className="btn btn-ghost btn-small pf-box-close" onClick={() => dialog.current?.close()}>
          Fechar
        </button>
      </dialog>
    </section>
  );
}
